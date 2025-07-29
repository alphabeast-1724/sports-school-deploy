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
import { Plus, Edit, Trash2, Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  grade_level?: number;
  student_id?: string;
  role?: string;
  house?: string;
}

interface House {
  id: string;
  name: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'student',
    house_id: '',
    grade_level: '',
    student_id: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchHouses();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          user_houses(house_id, houses(name))
        `);

      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        role: profile.user_roles?.[0]?.role || 'student',
        house: profile.user_houses?.[0]?.houses?.name || 'None'
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
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
        .select('id, name')
        .order('name');
      setHouses(data || []);
    } catch (error) {
      console.error('Error fetching houses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update existing user
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            grade_level: formData.grade_level ? parseInt(formData.grade_level) : null,
            student_id: formData.student_id || null,
            is_active: formData.is_active
          })
          .eq('user_id', editingUser.id);

        if (profileError) throw profileError;

        // Update role
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: editingUser.id,
            role: formData.role as 'student' | 'teacher' | 'admin'
          });

        if (roleError) throw roleError;

        // Update house assignment
        if (formData.house_id) {
          await supabase
            .from('user_houses')
            .delete()
            .eq('user_id', editingUser.id);

          const { error: houseError } = await supabase
            .from('user_houses')
            .insert({
              user_id: editingUser.id,
              house_id: formData.house_id
            });

          if (houseError) throw houseError;
        }

        toast({
          title: "Success",
          description: "User updated successfully"
        });
      } else {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: 'TempPassword123!',
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: formData.first_name,
              last_name: formData.last_name
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: authData.user.id,
              email: formData.email,
              first_name: formData.first_name,
              last_name: formData.last_name,
              grade_level: formData.grade_level ? parseInt(formData.grade_level) : null,
              student_id: formData.student_id || null,
              is_active: formData.is_active
            });

          if (profileError) throw profileError;

          // Assign role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
            role: formData.role as 'student' | 'teacher' | 'admin'
            });

          if (roleError) throw roleError;

          // Assign house
          if (formData.house_id) {
            const { error: houseError } = await supabase
              .from('user_houses')
              .insert({
                user_id: authData.user.id,
                house_id: formData.house_id
              });

            if (houseError) throw houseError;
          }
        }

        toast({
          title: "Success",
          description: "User created successfully"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deactivated successfully"
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      role: 'student',
      house_id: '',
      grade_level: '',
      student_id: '',
      is_active: true
    });
    setEditingUser(null);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role || 'student',
      house_id: '',
      grade_level: user.grade_level?.toString() || '',
      student_id: user.student_id || '',
      is_active: user.is_active
    });
    setIsDialogOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage students, teachers, and administrators</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogDescription>
                  {editingUser ? 'Update user information' : 'Create a new user account'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
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
                    <Label htmlFor="grade_level">Grade Level</Label>
                    <Input
                      id="grade_level"
                      type="number"
                      value={formData.grade_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, grade_level: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student_id">Student ID</Label>
                    <Input
                      id="student_id"
                      value={formData.student_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary">
                    {editingUser ? 'Update' : 'Create'} User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>House</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'teacher' ? 'secondary' : 'default'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.house}</TableCell>
                  <TableCell>{user.grade_level || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;