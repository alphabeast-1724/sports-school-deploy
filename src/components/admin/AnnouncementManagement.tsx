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
import { Plus, Edit, Trash2, Megaphone } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: number;
  is_active: boolean;
  target_audience: string[];
  expires_at?: string;
  created_at: string;
}

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: '1',
    is_active: true,
    target_audience: 'all',
    expires_at: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      setAnnouncements(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const currentUser = await supabase.auth.getUser();
      
      const announcementData = {
        title: formData.title,
        content: formData.content,
        priority: parseInt(formData.priority),
        is_active: formData.is_active,
        target_audience: [formData.target_audience],
        expires_at: formData.expires_at || null,
        created_by: currentUser.data.user?.id
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert(announcementData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement created successfully"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save announcement",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement deleted successfully"
      });
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !announcement.is_active })
        .eq('id', announcement.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Announcement ${!announcement.is_active ? 'activated' : 'deactivated'}`
      });
      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: '1',
      is_active: true,
      target_audience: 'all',
      expires_at: ''
    });
    setEditingAnnouncement(null);
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority.toString(),
      is_active: announcement.is_active,
      target_audience: announcement.target_audience[0] || 'all',
      expires_at: announcement.expires_at ? announcement.expires_at.split('T')[0] : ''
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
            <CardTitle>Announcement Management</CardTitle>
            <CardDescription>Create and manage announcements for students and staff</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
                <DialogDescription>
                  {editingAnnouncement ? 'Update announcement information' : 'Create a new announcement'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Low</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">High</SelectItem>
                        <SelectItem value="4">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_audience">Target Audience</Label>
                    <Select
                      value={formData.target_audience}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="teachers">Teachers Only</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary">
                    {editingAnnouncement ? 'Update' : 'Create'} Announcement
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
              <TableHead>Title</TableHead>
              <TableHead>Target Audience</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="font-medium">{announcement.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {announcement.target_audience[0] || 'all'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      announcement.priority >= 4 ? 'destructive' :
                      announcement.priority >= 3 ? 'default' :
                      announcement.priority >= 2 ? 'secondary' : 'outline'
                    }
                  >
                    {announcement.priority === 1 ? 'Low' :
                     announcement.priority === 2 ? 'Medium' :
                     announcement.priority === 3 ? 'High' : 'Critical'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(announcement)}
                  >
                    <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                      {announcement.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Button>
                </TableCell>
                <TableCell>
                  {announcement.expires_at 
                    ? new Date(announcement.expires_at).toLocaleDateString()
                    : 'Never'
                  }
                </TableCell>
                <TableCell>
                  {new Date(announcement.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
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

export default AnnouncementManagement;