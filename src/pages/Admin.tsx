import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserManagement from '@/components/admin/UserManagement';
import TeamManagement from '@/components/admin/TeamManagement';
import EventManagement from '@/components/admin/EventManagement';
import AnnouncementManagement from '@/components/admin/AnnouncementManagement';
import HousePointsManagement from '@/components/admin/HousePointsManagement';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Trophy, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus,
  TrendingUp,
  Medal,
  Activity,
  UserPlus,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeTeams: 0,
    upcomingEvents: 0,
    totalPoints: 0,
    monthlyGrowth: 0,
    engagementRate: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total students
      const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch active teams
      const { count: teamsCount } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch upcoming events
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'upcoming')
        .gte('event_date', new Date().toISOString().split('T')[0]);

      // Fetch total points
      const { data: pointsData } = await supabase
        .from('houses')
        .select('total_points');
      
      const totalPoints = pointsData?.reduce((sum, house) => sum + (house.total_points || 0), 0) || 0;

      setStats({
        totalStudents: studentsCount || 0,
        activeTeams: teamsCount || 0,
        upcomingEvents: eventsCount || 0,
        totalPoints,
        monthlyGrowth: 12.5, // Can be calculated based on historical data
        engagementRate: 89.2 // Can be calculated based on participation
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent house points
      const { data: pointsData } = await supabase
        .from('house_points')
        .select(`
          *,
          houses(name)
        `)
        .order('awarded_at', { ascending: false })
        .limit(10);

      const activities = pointsData?.map(point => ({
        id: point.id,
        type: 'points',
        message: `${point.houses?.name} earned ${point.points} points for ${point.reason}`,
        time: new Date(point.awarded_at).toLocaleDateString()
      })) || [];

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const quickActions = [
    { title: 'Award Points', icon: Trophy, description: 'Award points to houses', action: () => setActiveTab('points') },
    { title: 'Create Event', icon: Calendar, description: 'Schedule new sports event', action: () => setActiveTab('events') },
    { title: 'Add User', icon: UserPlus, description: 'Register new user', action: () => setActiveTab('users') },
    { title: 'Manage Teams', icon: Users, description: 'Edit team rosters', action: () => setActiveTab('teams') },
    { title: 'Announcements', icon: Megaphone, description: 'Create announcements', action: () => setActiveTab('announcements') }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage sports activities, teams, and house competitions
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 glass-card">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="points">Points</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="glass-card border-0 animate-fade-in">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{stats.monthlyGrowth}%</span>
                      <span>from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 animate-fade-in delay-100">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeTeams}</div>
                    <p className="text-xs text-muted-foreground">
                      Across 8 different sports
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 animate-fade-in delay-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                    <p className="text-xs text-muted-foreground">
                      Next 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 animate-fade-in delay-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                    <Medal className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all houses
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 animate-fade-in delay-400">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.engagementRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Student participation
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="glass-card border-0 animate-fade-in delay-500">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {quickActions.map((action, index) => (
                      <Button
                        key={action.title}
                        variant="outline"
                        className="h-24 flex-col space-y-2 hover:scale-105 transition-transform"
                        onClick={action.action}
                      >
                        <action.icon className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="glass-card border-0 animate-fade-in delay-600">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20">
                        <div className="flex-shrink-0">
                          {activity.type === 'points' && <Trophy className="h-5 w-5 text-primary" />}
                          {activity.type === 'event' && <Calendar className="h-5 w-5 text-secondary" />}
                          {activity.type === 'user' && <Users className="h-5 w-5 text-accent" />}
                          {activity.type === 'achievement' && <Medal className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-6">
              <TeamManagement />
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <EventManagement />
            </TabsContent>

            {/* Announcements Tab */}
            <TabsContent value="announcements" className="space-y-6">
              <AnnouncementManagement />
            </TabsContent>

            {/* House Points Tab */}
            <TabsContent value="points" className="space-y-6">
              <HousePointsManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;