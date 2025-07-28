import { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Award, ArrowRight } from 'lucide-react';
import { useHousePoints } from '@/components/hooks/useSupabaseData';

interface House {
  id: string;
  name: string;
  total_points: number;
  color: string;
}

const LeaderboardPreview = () => {
  const [animatedPoints, setAnimatedPoints] = useState<{ [key: string]: number }>({});
  const [isVisible, setIsVisible] = useState(false);
  const { houses, isLoading } = useHousePoints();

  const maxPoints = houses.length > 0 ? Math.max(...houses.map(house => house.total_points)) : 0;

  useEffect(() => {
    if (houses.length === 0) return;

    // Initialize animated points to 0
    const initialPoints: { [key: string]: number } = {};
    houses.forEach(house => {
      initialPoints[house.id] = 0;
    });
    setAnimatedPoints(initialPoints);

    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);

      // Animate points counting up
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const animatePoints = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentPoints: { [key: string]: number } = {};
        houses.forEach(house => {
          currentPoints[house.id] = Math.floor(house.total_points * progress);
        });
        
        setAnimatedPoints(currentPoints);
        
        if (progress < 1) {
          requestAnimationFrame(animatePoints);
        }
      };
      
      requestAnimationFrame(animatePoints);
    }, 500);

    return () => clearTimeout(timer);
  }, [houses]);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-6 w-6 text-primary" />;
    }
  };

  const getHouseGradient = (color: string) => {
    switch (color) {
      case 'red': return 'from-red-500 to-orange-500';
      case 'blue': return 'from-blue-500 to-indigo-500';
      case 'green': return 'from-green-500 to-emerald-500';
      case 'yellow': return 'from-yellow-500 to-amber-500';
      default: return 'from-primary to-secondary';
    }
  };

  const getHouseTextColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600';
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'yellow': return 'text-yellow-600';
      default: return 'text-primary';
    }
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-muted rounded mb-4 w-1/3 mx-auto animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (houses.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">House Championship</h2>
            <p className="text-muted-foreground">No house data available</p>
          </div>
        </div>
      </section>
    );
  }

  // Sort houses by points and add position
  const sortedHouses = [...houses].sort((a, b) => b.total_points - a.total_points);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            House Championship
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track the fierce competition between our school houses and see who's leading the race to glory!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sortedHouses.map((house, index) => {
            const position = index + 1;
            const percentage = maxPoints > 0 ? (animatedPoints[house.id] / maxPoints) * 100 : 0;
            
            return (
              <div
                key={house.id}
                className={`sport-card group ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getPositionIcon(position)}
                    <div>
                      <h3 className={`text-xl font-bold ${getHouseTextColor(house.color)}`}>
                        {house.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        #{position} Position
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {animatedPoints[house.id]?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getHouseGradient(house.color)} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: `${percentage}%`,
                        transition: isVisible ? 'width 2s ease-out' : 'none'
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white drop-shadow-lg">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button className="btn-primary group">
            <span>View Full Leaderboard</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPreview;