import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trophy, Medal, Award, TrendingUp, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HouseData {
  name: string;
  color: string;
  points: number;
  rank: number;
  sports: number;
  championships: number;
  recentWins: number;
  change: number;
}

interface SportLeaderboard {
  sport: string;
  icon: string;
  houses: {
    name: string;
    points: number;
    color: string;
    position: number;
  }[];
}

const mockHouseData: HouseData[] = [
  {
    name: 'Blue HOUSE',
    color: 'bg-blue-500',
    points: 1250,
    rank: 1,
    sports: 8,
    championships: 3,
    recentWins: 12,
    change: 5
  },
  {
    name: 'Red HOUSE',
    color: 'bg-red-500',
    points: 1180,
    rank: 2,
    sports: 7,
    championships: 2,
    recentWins: 10,
    change: -2
  },
  {
    name: 'Green HOUSE',
    color: 'bg-green-500',
    points: 1150,
    rank: 3,
    sports: 6,
    championships: 4,
    recentWins: 8,
    change: 3
  },
  {
    name: 'Yellow HOUSE',
    color: 'bg-yellow-500',
    points: 1090,
    rank: 4,
    sports: 7,
    championships: 1,
    recentWins: 7,
    change: -1
  }
];

const mockSportLeaderboards: SportLeaderboard[] = [
  {
    sport: 'Football',
    icon: '⚽',
    houses: [
      { name: 'Blue Dragons', points: 180, color: 'bg-blue-500', position: 1 },
      { name: 'Green Wolves', points: 165, color: 'bg-green-500', position: 2 },
      { name: 'Red Phoenix', points: 140, color: 'bg-red-500', position: 3 },
      { name: 'Yellow Eagles', points: 120, color: 'bg-yellow-500', position: 4 }
    ]
  },
  {
    sport: 'Basketball',
    icon: '🏀',
    houses: [
      { name: 'Red Phoenix', points: 195, color: 'bg-red-500', position: 1 },
      { name: 'Blue Dragons', points: 170, color: 'bg-blue-500', position: 2 },
      { name: 'Yellow Eagles', points: 155, color: 'bg-yellow-500', position: 3 },
      { name: 'Green Wolves', points: 135, color: 'bg-green-500', position: 4 }
    ]
  },
  {
    sport: 'Cricket',
    icon: '🏏',
    houses: [
      { name: 'Green Wolves', points: 210, color: 'bg-green-500', position: 1 },
      { name: 'Blue Dragons', points: 185, color: 'bg-blue-500', position: 2 },
      { name: 'Red Phoenix', points: 160, color: 'bg-red-500', position: 3 },
      { name: 'Yellow Eagles', points: 145, color: 'bg-yellow-500', position: 4 }
    ]
  }
];

const Leaderboard = () => {
  const [selectedTab, setSelectedTab] = useState('overall');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-500 text-sm">
          <TrendingUp size={16} className="mr-1" />
          +{change}
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-500 text-sm">
          <TrendingUp size={16} className="mr-1 rotate-180" />
          {change}
        </div>
      );
    }
    return <div className="text-muted-foreground text-sm">-</div>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              House Championship Leaderboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track the performance of our four houses across all sports competitions
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 glass-card">
              <TabsTrigger value="overall">Overall Standings</TabsTrigger>
              <TabsTrigger value="football">Football</TabsTrigger>
              <TabsTrigger value="basketball">Basketball</TabsTrigger>
              <TabsTrigger value="cricket">Cricket</TabsTrigger>
            </TabsList>

            {/* Overall Standings */}
            <TabsContent value="overall" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-xl text-center animate-fade-in">
                  <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-foreground">12</h3>
                  <p className="text-muted-foreground">Active Competitions</p>
                </div>
                <div className="glass-card p-6 rounded-xl text-center animate-fade-in delay-100">
                  <Users className="w-12 h-12 text-secondary mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-foreground">450+</h3>
                  <p className="text-muted-foreground">Student Athletes</p>
                </div>
                <div className="glass-card p-6 rounded-xl text-center animate-fade-in delay-200">
                  <Calendar className="w-12 h-12 text-accent mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-foreground">25</h3>
                  <p className="text-muted-foreground">Events This Month</p>
                </div>
              </div>

              {/* House Standings */}
              <div className="space-y-4">
                {mockHouseData.map((house, index) => (
                  <div
                    key={house.name}
                    className="glass-card p-6 rounded-xl animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                          {getRankIcon(house.rank)}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${house.color}`}></div>
                          <div>
                            <h3 className="text-xl font-heading font-bold text-foreground">
                              {house.name}
                            </h3>
                            <p className="text-muted-foreground">
                              {house.sports} sports • {house.championships} championships
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">
                            {house.points.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">Total Points</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-accent">
                            {house.recentWins}
                          </p>
                          <p className="text-sm text-muted-foreground">Recent Wins</p>
                        </div>
                        
                        <div className="text-right">
                          {getChangeIndicator(house.change)}
                          <p className="text-sm text-muted-foreground">This Week</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${house.color} transition-all duration-800`}
                          style={{ width: `${(house.points / 1250) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Sport-specific Leaderboards */}
            {mockSportLeaderboards.map((sport) => (
              <TabsContent
                key={sport.sport.toLowerCase()}
                value={sport.sport.toLowerCase()}
                className="space-y-6"
              >
                <div className="glass-card p-6 rounded-xl">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">{sport.icon}</div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">
                      {sport.sport} Championship
                    </h2>
                    <p className="text-muted-foreground">Current season standings</p>
                  </div>

                  <div className="space-y-4">
                    {sport.houses.map((house, index) => (
                      <div
                        key={house.name}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background">
                            {getRankIcon(house.position)}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${house.color}`}></div>
                            <span className="font-semibold text-foreground">
                              {house.name}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-foreground">
                            {house.points}
                          </p>
                          <p className="text-sm text-muted-foreground">Points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
