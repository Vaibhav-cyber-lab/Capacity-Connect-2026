import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (profileData: Partial<User['profile']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    storage.init();
    const savedUserId = localStorage.getItem('cc_active_user');
    if (savedUserId) {
      const found = storage.getUserById(savedUserId);
      if (found) setUser(found);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cc_active_user', userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cc_active_user');
  };

  const updateProfile = (profileData: Partial<User['profile']>) => {
    if (!user) return;
    const updated: User = {
      ...user,
      profile: { ...user.profile, ...profileData },
    };
    setUser(updated);
    storage.saveUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
