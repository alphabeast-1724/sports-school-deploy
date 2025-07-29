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
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  sport_id?: string;
  sport_name?: string;
  status: string;
  is_public: boolean;
  max_participants?: number;
  registration_deadline?: string;
}

interface Sport {
  id: string;
  name: string;
}

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    sport_id: '',
    status: 'upcoming',
    is_public: true,
    max_participants: '',
    registration_deadline: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchSports();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await supabase
        .from('events')
        .select(`
          *,
          sports(name)
        `)
        .order('event_date', { ascending: false });

      const eventsWithSports = data?.map(event => ({
        ...event,
        sport_name: event.sports?.name || 'General'
      })) || [];

      setEvents(eventsWithSports);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        title: formData.title,
        description: formData.description || null,
        event_date: formData.event_date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null,
        sport_id: formData.sport_id || null,
        status: formData.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
        is_public: formData.is_public,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        registration_deadline: formData.registration_deadline || null,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Event created successfully"
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully"
      });
      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      start_time: '',
      end_time: '',
      location: '',
      sport_id: '',
      status: 'upcoming',
      is_public: true,
      max_participants: '',
      registration_deadline: ''
    });
    setEditingEvent(null);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date,
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      location: event.location || '',
      sport_id: event.sport_id || '',
      status: event.status,
      is_public: event.is_public,
      max_participants: event.max_participants?.toString() || '',
      registration_deadline: event.registration_deadline || ''
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
            <CardTitle>Event Management</CardTitle>
            <CardDescription>Schedule and manage sports events</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                <DialogDescription>
                  {editingEvent ? 'Update event information' : 'Create a new sports event'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Event Date</Label>
                    <Input
                      id="event_date"
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    />
                  </div>
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
                        <SelectItem value="">General Event</SelectItem>
                        {sports.map(sport => (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input
                      id="max_participants"
                      type="number"
                      value={formData.max_participants}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration_deadline">Registration Deadline</Label>
                    <Input
                      id="registration_deadline"
                      type="date"
                      value={formData.registration_deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, registration_deadline: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                  />
                  <Label htmlFor="is_public">Public Event</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary">
                    {editingEvent ? 'Update' : 'Create'} Event
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
              <TableHead>Event Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {event.start_time && event.end_time 
                    ? `${event.start_time} - ${event.end_time}`
                    : event.start_time || 'TBD'
                  }
                </TableCell>
                <TableCell>{event.location || 'TBD'}</TableCell>
                <TableCell>{event.sport_name}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      event.status === 'completed' ? 'default' :
                      event.status === 'ongoing' ? 'secondary' :
                      event.status === 'cancelled' ? 'destructive' : 'outline'
                    }
                  >
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={event.is_public ? 'default' : 'secondary'}>
                    {event.is_public ? 'Public' : 'Private'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
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

export default EventManagement;