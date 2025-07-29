import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trophy, Minus } from 'lucide-react';

interface HousePoint {
  id: string;
  house_name: string;
  points: number;
  reason: string;
  category: string;
  awarded_at: string;
  awarded_by_name?: string;
  awarded_to_name?: string;
}

interface House {
  id: string;
  name: string;
  total_points: number;
}

interface User {
  id: string;
  name: string;
}

const HousePointsManagement = () => {
  const [housePoints, setHousePoints] = useState<HousePoint[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    house_id: '',
    points: '',
    reason: '',
    category: 'academic',
    awarded_to_user: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHousePoints();
    fetchHouses();
    fetchUsers();
  }, []);

  const fetchHousePoints = async () => {
    try {
      const { data } = await supabase
        .from('house_points')
        .select(`
          *,
          houses(name),
          awarded_by:profiles!house_points_awarded_by_fkey(first_name, last_name),
          awarded_to:profiles!house_points_awarded_to_user_fkey(first_name, last_name)
        `)
        .order('awarded_at', { ascending: false })
        .limit(50);

      const pointsWithNames = data?.map(point => ({
        ...point,
        house_name: point.houses?.name || 'Unknown',
        awarded_by_name: point.awarded_by ? `${point.awarded_by.first_name} ${point.awarded_by.last_name}` : 'System',
        awarded_to_name: point.awarded_to ? `${point.awarded_to.first_name} ${point.awarded_to.last_name}` : 'House'
      })) || [];

      setHousePoints(pointsWithNames);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch house points",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHouses = async () => {
    try {
      const { data } = await supabase
        .from('houses')
        .select('id, name, total_points')
        .order('name');
      setHouses(data || []);
    } catch (error) {
      console.error('Error fetching houses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('user_id as id, first_name, last_name')
        .eq('is_active', true);
      
      const usersWithNames = data?.map(user => ({
        ...user,
        name: `${user.first_name} ${user.last_name}`
      })) || [];
      
      setUsers(usersWithNames);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const currentUser = await supabase.auth.getUser();
      const points = parseInt(formData.points);
      
      const pointData = {
        house_id: formData.house_id,
        points: points,
        reason: formData.reason,
        category: formData.category as 'sports' | 'academics' | 'behavior' | 'participation',
        awarded_by: currentUser.data.user?.id,
        awarded_to_user: formData.awarded_to_user || null
      };

      const { error } = await supabase
        .from('house_points')
        .insert(pointData);

      if (error) throw error;

      // Update house total points manually
        const { data: currentHouse } = await supabase
          .from('houses')
          .select('total_points')
          .eq('id', formData.house_id)
          .single();

        if (currentHouse) {
          await supabase
            .from('houses')
            .update({ total_points: (currentHouse.total_points || 0) + points })
            .eq('id', formData.house_id);
        }
      }

      toast({
        title: "Success",
        description: `${points > 0 ? 'Awarded' : 'Deducted'} ${Math.abs(points)} points successfully`
      });

      resetForm();
      setIsDialogOpen(false);
      fetchHousePoints();
      fetchHouses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to award points",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      house_id: '',
      points: '',
      reason: '',
      category: 'academic',
      awarded_to_user: ''
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* House Standings */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>House Standings</CardTitle>
          <CardDescription>Current house point totals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {houses.map((house, index) => (
              <Card key={house.id} className="glass-card border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{house.name}</p>
                      <p className="text-2xl font-bold">{house.total_points}</p>
                    </div>
                    <Trophy className={`h-8 w-8 ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-orange-600' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
                    #{index + 1}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points Management */}
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>House Points Management</CardTitle>
              <CardDescription>Award or deduct points from houses</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Award Points
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Award/Deduct House Points</DialogTitle>
                  <DialogDescription>
                    Award points for achievements or deduct for violations
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="house">House</Label>
                      <Select
                        value={formData.house_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, house_id: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select house" />
                        </SelectTrigger>
                        <SelectContent>
                          {houses.map(house => (
                            <SelectItem key={house.id} value={house.id}>
                              {house.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points">Points</Label>
                      <Input
                        id="points"
                        type="number"
                        value={formData.points}
                        onChange={(e) => setFormData(prev => ({ ...prev, points: e.target.value }))}
                        placeholder="Use negative for deduction"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="behavior">Behavior</SelectItem>
                          <SelectItem value="participation">Participation</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="awarded_to">Award to Specific Student (Optional)</Label>
                      <Select
                        value={formData.awarded_to_user}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, awarded_to_user: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">House in general</SelectItem>
                          {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Explain why points are being awarded/deducted"
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="btn-primary">
                      {parseInt(formData.points) >= 0 ? 'Award' : 'Deduct'} Points
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>House</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Awarded To</TableHead>
                <TableHead>Awarded By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {housePoints.map((point) => (
                <TableRow key={point.id}>
                  <TableCell className="font-medium">{point.house_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {point.points > 0 ? (
                        <Plus className="h-4 w-4 text-green-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-red-500" />
                      )}
                      <span className={point.points > 0 ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(point.points)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{point.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{point.reason}</TableCell>
                  <TableCell>{point.awarded_to_name}</TableCell>
                  <TableCell>{point.awarded_by_name}</TableCell>
                  <TableCell>
                    {new Date(point.awarded_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HousePointsManagement;