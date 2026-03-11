
import React, { createContext, useContext, useState } from 'react';

interface DemoUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: DemoUser | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const DEMO_USER: DemoUser = {
  id: 'demo-user-001',
  email: 'demo@diceytimes.app',
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Demo mode: always logged in
  const [user] = useState<DemoUser | null>(DEMO_USER);

  const signUp = async () => ({ data: { user: DEMO_USER }, error: null });
  const signIn = async () => ({ data: { user: DEMO_USER }, error: null });
  const signOut = async () => {};

  const value = {
    user,
    session: { user: DEMO_USER },
    loading: false,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
