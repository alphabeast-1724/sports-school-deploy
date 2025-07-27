import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Users, Trophy, Calendar, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Team {
  id: string;
  name: string;
  sport: string;
  category: 'Junior' | 'Senior' | 'Mixed';
  house: 'Red' | 'Blue' | 'Green' | 'Yellow';
  coach: string;
  captain: string;
  members: number;
  wins: number;
  losses: number;
  image: string;
  status: 'Active' | 'Training' | 'Competition';
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Blue Lightning',
    sport: 'Football',
    category: 'Senior',
    house: 'Blue',
    coach: 'Mr. Smith',
    captain: 'Alex Johnson',
    members: 15,
    wins: 8,
    losses: 2,
    image: '/api/placeholder/300/200',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Red Tigers',
    sport: 'Basketball',
    category: 'Junior',
    house: 'Red',
    coach: 'Ms. Davis',
    captain: 'Emma Wilson',
    members: 12,
    wins: 6,
    losses: 3,
    image: '/api/placeholder/300/200',
    status: 'Competition'
  },
  {
    id: '3',
    name: 'Green Eagles',
    sport: 'Cricket',
    category: 'Senior',
    house: 'Green',
    coach: 'Mr. Brown',
    captain: 'Sam Miller',
    members: 18,
    wins: 10,
    losses: 1,
    image: '/api/placeholder/300/200',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Yellow Wolves',
    sport: 'Volleyball',
    category: 'Mixed',
    house: 'Yellow',
    coach: 'Ms. Taylor',
    captain: 'Jordan Lee',
    members: 10,
    wins: 5,
    losses: 4,
    image: '/api/placeholder/300/200',
    status: 'Training'
  }
];

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHouse, setSelectedHouse] = useState('all');

  const filteredTeams = useMemo(() => {
    return mockTeams.filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           team.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           team.coach.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           team.captain.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSport = selectedSport === 'all' || team.sport === selectedSport;
      const matchesCategory = selectedCategory === 'all' || team.category === selectedCategory;
      const matchesHouse = selectedHouse === 'all' || team.house === selectedHouse;

      return matchesSearch && matchesSport && matchesCategory && matchesHouse;
    });
  }, [searchTerm, selectedSport, selectedCategory, selectedHouse]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-accent text-accent-foreground';
      case 'Competition': return 'bg-secondary text-secondary-foreground';
      case 'Training': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getHouseColor = (house: string) => {
    switch (house) {
      case 'Red': return 'bg-red-500 text-white';
      case 'Blue': return 'bg-blue-500 text-white';
      case 'Green': return 'bg-green-500 text-white';
      case 'Yellow': return 'bg-yellow-500 text-black';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Our Sports Teams
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our talented athletes and their achievements across various sports disciplines
            </p>
          </div>

          {/* Filters Section */}
          <div className="glass-card p-6 rounded-xl mb-8 animate-fade-in delay-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Search teams, sports, coaches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Sports" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    <SelectItem value="Football">Football</SelectItem>
                    <SelectItem value="Basketball">Basketball</SelectItem>
                    <SelectItem value="Cricket">Cricket</SelectItem>
                    <SelectItem value="Volleyball">Volleyball</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedHouse} onValueChange={setSelectedHouse}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Houses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Houses</SelectItem>
                    <SelectItem value="Red">Red House</SelectItem>
                    <SelectItem value="Blue">Blue House</SelectItem>
                    <SelectItem value="Green">Green House</SelectItem>
                    <SelectItem value="Yellow">Yellow House</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredTeams.length} of {mockTeams.length} teams
            </p>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team, index) => (
              <div
                key={team.id}
                className="sport-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Team Image */}
                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Users size={48} className="text-muted-foreground" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className={getStatusColor(team.status)}>
                      {team.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className={getHouseColor(team.house)}>
                      {team.house} House
                    </Badge>
                  </div>
                </div>

                {/* Team Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      {team.name}
                    </h3>
                    <p className="text-muted-foreground">{team.sport} • {team.category}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coach:</span>
                      <span className="font-medium">{team.coach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Captain:</span>
                      <span className="font-medium">{team.captain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Members:</span>
                      <span className="font-medium">{team.members}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <div className="flex items-center space-x-1 text-accent">
                      <Trophy size={16} />
                      <span className="text-sm font-medium">{team.wins}W</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {team.losses}L
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {team.wins + team.losses} Played
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full btn-primary mt-4">
                    View Team Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTeams.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <Users size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                No teams found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Teams;
