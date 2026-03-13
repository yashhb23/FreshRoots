import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {User, AuthTokens} from '../types';
import {authService} from '../services/api';
import {parseApiError} from '../services/api/client';
import {
  getTokens,
  setTokens,
  clearTokens,
  getUser,
  setUser,
  clearUser,
  clearAllData,
} from '../utils/storage';
import {
  signInAnonymously,
  signInWithGoogle,
  syncUserProfile,
  createUserProfile,
  trackUserEvent,
  signOutFromFirebase,
  getCurrentFirebaseUser,
} from '../services/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: 'buyer' | 'seller',
  ) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const tokens = await getTokens();
      const storedUser = await getUser();

      if (tokens && storedUser) {
        setUserState(storedUser);
        setIsAuthenticated(true);
        
        // Ensure Firebase is initialized (anonymous if no user)
        const firebaseUser = getCurrentFirebaseUser();
        if (!firebaseUser) {
          await signInAnonymously();
        }

        // Sync user profile to Firestore
        const fbUser = getCurrentFirebaseUser();
        if (fbUser) {
          await syncUserProfile(storedUser.id, {
            email: storedUser.email,
            name: storedUser.name,
            phone: storedUser.phone,
            firebaseUid: fbUser.uid,
          });
        }
      } else {
        // Sign in anonymously for guest users
        await signInAnonymously();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Still try to init Firebase anonymously
      try {
        await signInAnonymously();
      } catch (fbError) {
        console.error('Firebase anonymous sign-in error:', fbError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({email, password});

      if (response.success && response.data) {
        const {user: userData, accessToken, refreshToken} = response.data;

        // Store tokens and user
        await setTokens({accessToken, refreshToken});
        await setUser(userData);

        setUserState(userData);
        setIsAuthenticated(true);
        setIsGuest(false);

        // Sync to Firestore
        const firebaseUser = getCurrentFirebaseUser();
        if (firebaseUser) {
          await syncUserProfile(userData.id, {
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            firebaseUid: firebaseUser.uid,
          });
          
          // Track login event
          await trackUserEvent(userData.id, 'user_logged_in', {
            method: 'email',
          });
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const apiError = parseApiError(error);
      throw new Error(apiError.message);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: 'buyer' | 'seller',
  ) => {
    try {
      const response = await authService.register({
        name,
        email,
        password,
        phone,
        role: role || 'buyer',
      });

      if (response.success && response.data) {
        const {user: userData, accessToken, refreshToken} = response.data;

        // Store tokens and user
        await setTokens({accessToken, refreshToken});
        await setUser(userData);

        setUserState(userData);
        setIsAuthenticated(true);
        setIsGuest(false);

        // Create Firestore profile
        const firebaseUser = getCurrentFirebaseUser();
        if (firebaseUser) {
          await createUserProfile(userData.id, {
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            firebaseUid: firebaseUser.uid,
          });
          
          // Track registration event
          await trackUserEvent(userData.id, 'user_registered', {
            method: 'email',
          });
        }
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const apiError = parseApiError(error);
      throw new Error(apiError.message);
    }
  };

  /**
   * Google Sign-In via Firebase.
   * 1. Opens Google sign-in popup via Firebase
   * 2. Sends Google user info to backend /api/auth/google
   * 3. Backend creates or finds existing user, returns JWT tokens
   * 4. Syncs profile to Firestore
   */
  const googleSignIn = async () => {
    try {
      // Step 1: Firebase Google Sign-In
      const googleResult = await signInWithGoogle();
      const googleUser = googleResult.googleUser;
      const firebaseUser = googleResult.firebaseUser;

      if (!googleUser?.email || !googleUser?.name) {
        throw new Error('Could not get Google account info');
      }

      // Step 2: Send to backend to create/login user
      const response = await authService.googleAuth({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        photoUrl: googleUser.photo || undefined,
      });

      if (response.success && response.data) {
        const {user: userData, accessToken, refreshToken} = response.data;

        // Step 3: Store tokens and user
        await setTokens({accessToken, refreshToken});
        await setUser(userData);

        setUserState(userData);
        setIsAuthenticated(true);
        setIsGuest(false);

        // Step 4: Sync to Firestore
        if (firebaseUser) {
          await syncUserProfile(userData.id, {
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            firebaseUid: firebaseUser.uid,
          });

          await trackUserEvent(userData.id, 'user_logged_in', {
            method: 'google',
          });
        }
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Handle specific Google Sign-In errors
      if (error.code === 'SIGN_IN_CANCELLED') {
        throw new Error('Sign-in was cancelled');
      }
      if (error.code === 'IN_PROGRESS') {
        throw new Error('Sign-in already in progress');
      }
      if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services not available');
      }
      
      const apiError = parseApiError(error);
      throw new Error(apiError.message);
    }
  };

  const logout = async () => {
    try {
      await clearAllData();
      
      // Sign out from Firebase (but sign back in anonymously)
      await signOutFromFirebase();
      await signInAnonymously();
      
      setUserState(null);
      setIsAuthenticated(false);
      setIsGuest(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const continueAsGuest = async () => {
    try {
      // Ensure Firebase anonymous auth is initialized
      const firebaseUser = getCurrentFirebaseUser();
      if (!firebaseUser) {
        await signInAnonymously();
      }
      
      setIsGuest(true);
      setIsLoading(false);
      setIsAuthenticated(false);
      setUserState(null);
    } catch (error) {
      console.error('Guest mode error:', error);
      // Continue anyway
      setIsGuest(true);
      setIsLoading(false);
      setIsAuthenticated(false);
      setUserState(null);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        await setUser(response.data);
        setUserState(response.data);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isGuest,
        login,
        register,
        googleSignIn,
        logout,
        continueAsGuest,
        refreshUserData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
