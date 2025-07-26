import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for admin dashboard
  const stats = {
    totalStudents: 1247,
    activeTeams: 24,
    upcomingEvents: 8,
    totalPoints: 4670,
    monthlyGrowth: 12.5,
    engagementRate: 89.2
  };

  const recentActivities = [
    { id: 1, type: 'points', message: 'Blue Dragons earned 50 points in Football', time: '2 hours ago' },
    { id: 2, type: 'event', message: 'Basketball Tournament scheduled for next week', time: '4 hours ago' },
    { id: 3, type: 'user', message: 'New student Alex Johnson joined Red Phoenix', time: '6 hours ago' },
    { id: 4, type: 'achievement', message: 'Green Wolves won Swimming Championship', time: '1 day ago' }
  ];

  const quickActions = [
    { title: 'Add Points', icon: Trophy, description: 'Award points to houses', color: 'bg-primary' },
    { title: 'Create Event', icon: Calendar, description: 'Schedule new sports event', color: 'bg-secondary' },
    { title: 'Add Student', icon: UserPlus, description: 'Register new student', color: 'bg-accent' },
    { title: 'Manage Teams', icon: Users, description: 'Edit team rosters', color: 'bg-muted' }
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
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 glass-card">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <Button
                        key={action.title}
                        variant="outline"
                        className="h-24 flex-col space-y-2 hover:scale-105 transition-transform"
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
              <Card className="glass-card border-0">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage students, teachers, and administrators</CardDescription>
                    </div>
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">User Management</h3>
                    <p className="text-muted-foreground">
                      User management interface would be implemented here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Team Management</CardTitle>
                      <CardDescription>Manage sports teams and rosters</CardDescription>
                    </div>
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Team
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Team Management</h3>
                    <p className="text-muted-foreground">
                      Team management interface would be implemented here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Event Management</CardTitle>
                      <CardDescription>Schedule and manage sports events</CardDescription>
                    </div>
                    <Button className="btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Event Management</h3>
                    <p className="text-muted-foreground">
                      Event management interface would be implemented here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>View detailed statistics and generate reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground">
                      Analytics and reporting interface would be implemented here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;