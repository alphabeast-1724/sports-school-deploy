import { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Award, ArrowRight } from 'lucide-react';

interface House {
  id: number;
  name: string;
  points: number;
  color: string;
  gradient: string;
  position: number;
}

const mockHouses: House[] = [
  {
    id: 1,
    name: "RED House",
    points: 2450,
    color: "text-red-600",
    gradient: "from-red-500 to-orange-500",
    position: 1
  },
  {
    id: 2,
    name: "BLUE House",
    points: 2340,
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-500",
    position: 2
  },
  {
    id: 3,
    name: "GREEN House",
    points: 2210,
    color: "text-green-600",
    gradient: "from-green-500 to-emerald-500",
    position: 3
  },
  {
    id: 4,
    name: "YELLOW House",
    points: 2180,
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-yellow-500",
    position: 4
  }
];

const LeaderboardPreview = () => {
  const [animatedPoints, setAnimatedPoints] = useState<{ [key: number]: number }>({});
  const [isVisible, setIsVisible] = useState(false);

  const maxPoints = Math.max(...mockHouses.map(house => house.points));

  useEffect(() => {
    // Initialize animated points to 0
    const initialPoints: { [key: number]: number } = {};
    mockHouses.forEach(house => {
      initialPoints[house.id] = 0;
    });
    setAnimatedPoints(initialPoints);

    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
      const targetPoints: { [key: number]: number } = {};
      mockHouses.forEach(house => {
        targetPoints[house.id] = house.points;
      });

      // Animate points counting up
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const animatePoints = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentPoints: { [key: number]: number } = {};
        mockHouses.forEach(house => {
          currentPoints[house.id] = Math.floor(house.points * progress);
        });
        
        setAnimatedPoints(currentPoints);
        
        if (progress < 1) {
          requestAnimationFrame(animatePoints);
        }
      };
      
      requestAnimationFrame(animatePoints);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
          {mockHouses.map((house, index) => {
            const percentage = maxPoints > 0 ? (animatedPoints[house.id] / maxPoints) * 100 : 0;
            
            return (
              <div
                key={house.id}
                className={`sport-card group ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getPositionIcon(house.position)}
                    <div>
                      <h3 className={`text-xl font-bold ${house.color}`}>
                        {house.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        #{house.position} Position
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
                      className={`h-full bg-gradient-to-r ${house.gradient} rounded-full transition-all duration-1000 ease-out`}
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
