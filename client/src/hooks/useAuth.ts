import { useState, useEffect, createContext, useContext } from 'react';
import type { AuthUser, User, Manager, UserType } from '@/types';

interface AuthContextType {
  user: AuthUser;
  userType: UserType;
  login: (userData: User | Manager, type: UserType) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthState() {
  const [user, setUser] = useState<AuthUser>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('techpark-user');
    const storedType = localStorage.getItem('techpark-user-type') as UserType;
    
    if (storedUser && storedType) {
      setUser(JSON.parse(storedUser));
      setUserType(storedType);
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User | Manager, type: UserType) => {
    if (!type) return;
    setUser(userData);
    setUserType(type);
    localStorage.setItem('techpark-user', JSON.stringify(userData));
    localStorage.setItem('techpark-user-type', type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('techpark-user');
    localStorage.removeItem('techpark-user-type');
  };

  return {
    user,
    userType,
    login,
    logout,
    isLoading
  };
}

export { AuthContext };
