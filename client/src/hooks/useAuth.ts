
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AuthUser, User, Manager, UserType } from '@/types';

interface AuthContextType {
  user: AuthUser;
  userType: UserType;
  login: (email: string, password: string, type: UserType) => Promise<void>;
  loginUser: (user: User | Manager, type: UserType) => void;
  register: (userData: Partial<User | Manager>, password: string, type: UserType) => Promise<void>;
  logout: () => Promise<void>;
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
    // Check if Firebase is available
    if (!auth || !db) {
      console.warn('Firebase not available, using fallback authentication');
      // Check for stored auth data in localStorage as fallback
      const storedUser = localStorage.getItem('techpark-user');
      const storedType = localStorage.getItem('techpark-user-type') as UserType;
      
      if (storedUser && storedType) {
        try {
          setUser(JSON.parse(storedUser));
          setUserType(storedType);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('techpark-user');
          localStorage.removeItem('techpark-user-type');
        }
      }
      
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData as User | Manager);
            setUserType(userData.role === 'manager' ? 'manager' : 'employee');
          } else {
            // If no user document exists, create one
            const newUser = {
              id: firebaseUser.uid,
              username: firebaseUser.email || '',
              email: firebaseUser.email,
              employeeName: firebaseUser.displayName || 'Demo User',
              techPark: 'Manyata Tech Park',
              company: 'TechCorp Solutions',
              designation: 'Software Engineer',
              mobile: '9876543210',
              role: 'employee',
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser as User);
            setUserType('employee');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setUserType(null);
        }
      } else {
        setUser(null);
        setUserType(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, type: UserType) => {
    if (!auth || !db) {
      // Fallback to mock authentication for demo
      console.warn('Using fallback authentication - this is for demo purposes only');
      
      // Mock user data based on type
        const mockUser = type === 'manager' 
        ? {
            id: 'mock-manager-1',
            username: email,
            email: email,
            name: 'Demo Manager',
            restaurantName: 'Canteen Delight',
            techPark: 'Manyata Tech Park',
            role: 'manager',
            createdAt: new Date().toISOString(),
          } as Manager
        : {
            id: 'mock-user-1',
            username: typeof email === 'string' ? email.replace('@techpark.local', '') : '9876543210',
            email: email,
            employeeName: 'Demo User',
            techPark: 'Manyata Tech Park',
            company: 'TechCorp Solutions',
            designation: 'Software Engineer',
            mobile: typeof email === 'string' ? email.replace('@techpark.local', '') : '9876543210',
            role: 'employee',
            createdAt: new Date().toISOString(),
          } as User;

      setUser(mockUser);
      setUserType(type);
      
      // Store in localStorage for persistence
      localStorage.setItem('techpark-user', JSON.stringify(mockUser));
      if (type) {
        localStorage.setItem('techpark-user-type', type);
      }
      
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData as User | Manager);
        setUserType(userData.role === 'manager' ? 'manager' : 'employee');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: Partial<User | Manager>, password: string, type: UserType) => {
    if (!auth || !db) {
      // Fallback to mock registration for demo
      console.warn('Using fallback registration - this is for demo purposes only');
      
      const newUser = {
        id: `mock-${type}-${Date.now()}`,
        username: (userData as any).email || (userData as any).mobile || '',
        ...userData,
        role: type,
        createdAt: new Date().toISOString(),
      } as User | Manager;

      setUser(newUser);
      setUserType(type);
      
      // Store in localStorage for persistence
      localStorage.setItem('techpark-user', JSON.stringify(newUser));
      if (type) {
        localStorage.setItem('techpark-user-type', type);
      }
      
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, (userData as any).email!, password);
      const firebaseUser = userCredential.user;
      
      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: (userData as any).employeeName || (userData as any).name || '',
      });
      
      // Create user document in Firestore
      const newUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        role: type,
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser as User | Manager);
      setUserType(type);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const loginUser = (user: User | Manager, type: UserType) => {
    setUser(user);
    setUserType(type);
    localStorage.setItem('techpark-user', JSON.stringify(user));
    if (type) {
      localStorage.setItem('techpark-user-type', type);
    }
  };

  const logout = async () => {
    if (!auth) {
      console.warn('Firebase not available, clearing local state');
      setUser(null);
      setUserType(null);
      localStorage.removeItem('techpark-user');
      localStorage.removeItem('techpark-user-type');
      return;
    }

    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    userType,
    login,
    loginUser,
    register,
    logout,
    isLoading
  };
}

export { AuthContext };
