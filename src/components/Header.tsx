import { User, Menu, LogOut, Home, Users, Trophy, ImageIcon, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import schoolLogo from '@/assets/school-logo.png';
import React, { useState } from 'react';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/teams"
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
              >
                Teams
              </Link>
              <Link
                to="/leaderboard"
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
              >
                Leaderboard
              </Link>
              <Link
                to="/gallery"
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
              >
                Gallery
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
                >
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                  >
                    <User size={16} />
                    <span className="text-sm font-medium">{user?.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-border">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="btn-primary">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
                aria-label="Menu"
              >
                <Menu size={20} />
              </button>

              {mobileMenuOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <Home size={16} className="mr-2" /> Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/teams"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <Users size={16} className="mr-2" /> Teams
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/leaderboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <Trophy size={16} className="mr-2" /> Leaderboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/gallery"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <ImageIcon size={16} className="mr-2" /> Gallery
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center px-4 py-2 hover:bg-gray-100"
                        >
                          <Shield size={16} className="mr-2" /> Admin
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut size={16} className="mr-2" /> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
