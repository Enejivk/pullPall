import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { Loader2 } from 'lucide-react';
import { handleAuthCallback } from '../api/auth';


export const AuthCallback = () => {
  const { setUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data after authentication callback
    const fetchUser = async () => {
      try {
        const user = await handleAuthCallback()
        console.log('User data fetched:', user);
        setUser(user);
        // navigate('/dashboard');
      } catch (error) {
        // navigate('/')
      }
    }

    fetchUser();
  }, [setUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Completing Login
        </h1>
        <p className="text-muted-foreground">
          Please wait while we authenticate your GitHub account...
        </p>
      </div>
    </div>
  );
};
