import { useEffect, useRef, useState } from 'react';
import { Megaphone, Calendar, Trophy, AlertCircle } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  message: string;
  type: 'event' | 'achievement' | 'alert' | 'general';
  date: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Basketball Championship Finals",
    message: "Join us for the exciting finals this Friday at 4 PM in the main gymnasium!",
    type: "event",
    date: "2025-01-30"
  },
  {
    id: 2,
    title: "Swimming Team Victory",
    message: "Congratulations to our swimming team for winning the inter-school competition!",
    type: "achievement",
    date: "2025-01-28"
  },
  {
    id: 3,
    title: "New Sports Equipment",
    message: "We've added new tennis courts and volleyball nets. Book your sessions now!",
    type: "general",
    date: "2025-01-27"
  },
  {
    id: 4,
    title: "Weather Advisory",
    message: "Outdoor activities cancelled due to rain. All events moved to indoor facilities.",
    type: "alert",
    date: "2025-01-26"
  }
];

const AnnouncementsSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        const container = scrollRef.current;
        const cardWidth = 320; // min-w-80 = 320px
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += cardWidth;
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-accent" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Megaphone className="h-5 w-5 text-secondary" />;
    }
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'event':
        return 'border-l-4 border-primary bg-primary/5';
      case 'achievement':
        return 'border-l-4 border-accent bg-accent/5';
      case 'alert':
        return 'border-l-4 border-destructive bg-destructive/5';
      default:
        return 'border-l-4 border-secondary bg-secondary/5';
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-6">
          <Megaphone className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Latest Announcements
          </h2>
        </div>
        
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {mockAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`min-w-80 glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300 ${getCardStyle(announcement.type)}`}
            >
              <div className="flex items-start space-x-3 mb-3">
                {getIcon(announcement.type)}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(announcement.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <p className="text-foreground/80 leading-relaxed">
                {announcement.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSlider;