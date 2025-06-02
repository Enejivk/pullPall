import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, LogOut } from 'lucide-react';
import { useAppStore } from '../../lib/store';
import { Button } from '../ui/Button';
import { handleGithubAuth } from '../../api/auth';

export const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAppStore();
  const location = useLocation();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };
  
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks: { name: string; path: string; external?: boolean }[] = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/#how-it-works' },
  ];



  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-background/90 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            >
              <path d="M21 10.09a9 9 0 0 1-8.92 10 9 9 0 0 1-8-4.19M3 13.91a9 9 0 0 1 8.92-10 9 9 0 0 1 8 4.19" />
              <path d="M14.7 16.5 13 20H7l1.7-3.5" />
              <path d="M9.3 7.5 11 4h6l-1.7 3.5" />
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PR Sensei
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-foreground/80 hover:text-foreground transition-colors duration-200 ${location.pathname === link.path ? 'text-foreground font-medium' : ''
                    }`}
                >
                  {link.name}
                </Link>
              )
            )}

            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  {/* <div className="flex items-center gap-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-border"
                    />
                    <span>{user.name}</span>
                  </div> */}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            )
            
            : (
              <div className="flex items-center gap-3">
                <Button
                onClick={() => handleGithubAuth()}
                  variant="primary"
                  className="animate-glow"
                  icon={<Github size={16} />}
                >
                  Login with GitHub
                </Button>

              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-border animate-in fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Use the App
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};