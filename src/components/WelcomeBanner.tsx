import { Calendar, Trophy, Users } from 'lucide-react';
import heroImage from '@/assets/hero-sports.jpg';

interface WelcomeBannerProps {
  userFirstName?: string;
}

const WelcomeBanner = ({ userFirstName = "Student" }: WelcomeBannerProps) => {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Sports Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/70"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-fade-in">
            👋 Welcome, {userFirstName}!
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto animate-fade-in delay-200">
            Track your sports achievements, explore teams, and celebrate victories at{' '}
            <span className="font-bold text-secondary-glow">Noble-Saint-English-School</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 animate-fade-in delay-400">
            <div className="glass-card text-center p-4 rounded-xl">
              <Trophy className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-white/80">Championships</div>
            </div>
            
            <div className="glass-card text-center p-4 rounded-xl">
              <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-white/80">Active Teams</div>
            </div>
            
            <div className="glass-card text-center p-4 rounded-xl">
              <Calendar className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-white/80">Upcoming Events</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;