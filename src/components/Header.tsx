import { User, Menu } from 'lucide-react';
import schoolLogo from '@/assets/school-logo.png';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <img 
              src={schoolLogo} 
              alt="NSES Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-bold text-primary">
                SportsHub
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                NOBLE-SAINT-ENGLISH-SCHOOL
              </p>
            </div>
          </div>

          {/* Center Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
            >
              Home
            </a>
            <a 
              href="#teams" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
            >
              Teams
            </a>
            <a 
              href="#leaderboard" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
            >
              Leaderboard
            </a>
            <a 
              href="#gallery" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
            >
              Gallery
            </a>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              aria-label="Profile"
            >
              <User size={16} />
              <span className="text-sm font-medium">Profile</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;