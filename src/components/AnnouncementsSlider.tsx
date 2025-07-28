import { useEffect, useRef, useState } from 'react';
import { Megaphone, Calendar, Trophy, AlertCircle } from 'lucide-react';
import { useAnnouncements } from '@/components/hooks/useSupabaseData';

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: string[];
  priority: number;
  created_at: string;
}

const AnnouncementsSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { announcements, isLoading } = useAnnouncements();

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

  const getIcon = (priority: number) => {
    if (priority >= 3) return <AlertCircle className="h-5 w-5 text-destructive" />;
    if (priority === 2) return <Calendar className="h-5 w-5 text-primary" />;
    return <Megaphone className="h-5 w-5 text-secondary" />;
  };

  const getCardStyle = (priority: number) => {
    if (priority >= 3) return 'border-l-4 border-destructive bg-destructive/5';
    if (priority === 2) return 'border-l-4 border-primary bg-primary/5';
    return 'border-l-4 border-secondary bg-secondary/5';
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-6">
            <Megaphone className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Latest Announcements
            </h2>
          </div>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-80 glass-card p-6 rounded-xl animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-6">
            <Megaphone className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Latest Announcements
            </h2>
          </div>
          <div className="glass-card p-6 rounded-xl text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No announcements at this time</p>
          </div>
        </div>
      </section>
    );
  }

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
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`min-w-80 glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300 ${getCardStyle(announcement.priority)}`}
            >
              <div className="flex items-start space-x-3 mb-3">
                {getIcon(announcement.priority)}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(announcement.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <p className="text-foreground/80 leading-relaxed">
                {announcement.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSlider;