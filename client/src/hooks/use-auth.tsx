import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginMutation = {
    mutateAsync: async (credentials: any) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.username || credentials.email,
        password: credentials.password,
      });
      if (error) {
        toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
        throw error;
      }
      return data.user;
    },
  };

  const registerMutation = {
    mutateAsync: async (credentials: any) => {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email || credentials.username,
        password: credentials.password,
      });
      if (error) {
        toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
        throw error;
      }
      return data.user;
    },
  };

  const logoutMutation = {
    mutateAsync: async () => {
      await supabase.auth.signOut();
    },
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error: null,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

