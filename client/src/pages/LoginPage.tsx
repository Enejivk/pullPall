import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../lib/store';

export const LoginPage: React.FC = () => {
  const { user, setUser } = useAppStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/dashboard\" replace />;
  }

  const handleGitHubAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For demo: simulate GitHub OAuth flow
      const demoUser = {
        id: '1',
        name: 'Demo User',
        username: 'demouser',
        avatar: 'https://github.com/github.png',
        token: 'demo-token'
      };

      setTimeout(() => {
        setUser(demoUser);
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError('Failed to authenticate with GitHub. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass p-8 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="relative z-10">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Connect with GitHub</h2>
              <p className="text-muted-foreground">
                Authenticate to start reviewing your pull requests
              </p>
            </div>

            {/* Auth Button */}
            <Button
              className="w-full mb-6"
              size="lg"
              variant="primary"
              icon={<Github size={20} />}
              iconPosition="left"
              isLoading={isLoading}
              onClick={handleGitHubAuth}
            >
              {isLoading ? 'Connecting...' : 'Continue with GitHub'}
            </Button>

            {error && (
              <div className="text-error text-sm text-center mb-6">
                {error}
              </div>
            )}

            {/* Features List */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight size={16} className="text-primary" />
                <span>Access your repositories and pull requests</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight size={16} className="text-primary" />
                <span>Post reviews directly to GitHub</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight size={16} className="text-primary" />
                <span>Sync with your GitHub account</span>
              </div>
            </div>

            {/* Terms and Privacy */}
            <p className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};