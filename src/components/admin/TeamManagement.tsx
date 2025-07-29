import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  sport_id: string;
  house_id: string;
  captain_id?: string;
  coach_id?: string;
  sport_name: string;
  house_name: string;
  wins: number;
  losses: number;
  draws: number;
  is_active: boolean;
  captain_name?: string;
  coach_name?: string;
}

interface Sport {
  id: string;
  name: string;
}

interface House {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sport_id: '',
    house_id: '',
    captain_id: '',
    coach_id: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
    fetchSports();
    fetchHouses();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data } = await supabase
        .from('teams')
        .select(`
          *,
          sports(name),
          houses(name),
          captain:profiles!teams_captain_id_fkey(first_name, last_name),
          coach:profiles!teams_coach_id_fkey(first_name, last_name)
        `);

      const teamsWithNames = data?.map(team => ({
        ...team,
        sport_name: team.sports?.name || 'Unknown',
        house_name: team.houses?.name || 'Unknown',
        captain_name: team.captain ? `${team.captain.first_name} ${team.captain.last_name}` : 'None',
        coach_name: team.coach ? `${team.coach.first_name} ${team.coach.last_name}` : 'None'
      })) || [];

      setTeams(teamsWithNames);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const { data } = await supabase
        .from('sports')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      setSports(data || []);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchHouses = async () => {
    try {
      const { data } = await supabase
        .from('houses')
        .select('id, name')
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
      const teamData = {
        name: formData.name,
        sport_id: formData.sport_id,
        house_id: formData.house_id,
        captain_id: formData.captain_id || null,
        coach_id: formData.coach_id || null,
        is_active: formData.is_active
      };

      if (editingTeam) {
        const { error } = await supabase
          .from('teams')
          .update(teamData)
          .eq('id', editingTeam.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Team updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('teams')
          .insert(teamData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Team created successfully"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchTeams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save team",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team deleted successfully"
      });
      fetchTeams();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sport_id: '',
      house_id: '',
      captain_id: '',
      coach_id: '',
      is_active: true
    });
    setEditingTeam(null);
  };

  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      sport_id: team.sport_id,
      house_id: team.house_id,
      captain_id: team.captain_id || '',
      coach_id: team.coach_id || '',
      is_active: team.is_active
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>Manage sports teams and rosters</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTeam ? 'Edit Team' : 'Create New Team'}</DialogTitle>
                <DialogDescription>
                  {editingTeam ? 'Update team information' : 'Create a new sports team'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport</Label>
                    <Select
                      value={formData.sport_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, sport_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map(sport => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="house">House</Label>
                    <Select
                      value={formData.house_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, house_id: value }))}
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="captain">Captain</Label>
                    <Select
                      value={formData.captain_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, captain_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select captain" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coach">Coach</Label>
                    <Select
                      value={formData.coach_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, coach_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select coach" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary">
                    {editingTeam ? 'Update' : 'Create'} Team
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
              <TableHead>Team Name</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>House</TableHead>
              <TableHead>Captain</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Record</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.sport_name}</TableCell>
                <TableCell>{team.house_name}</TableCell>
                <TableCell>{team.captain_name}</TableCell>
                <TableCell>{team.coach_name}</TableCell>
                <TableCell>
                  {team.wins}W-{team.losses}L-{team.draws}D
                </TableCell>
                <TableCell>
                  <Badge variant={team.is_active ? 'default' : 'secondary'}>
                    {team.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(team)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(team.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeamManagement;