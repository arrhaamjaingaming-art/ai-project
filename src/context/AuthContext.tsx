import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  saveUserToDatabase,
  getUserProfileFromDatabase,
  FirebaseUser,
} from '../lib/firebase';
import { UserProfile, LanguageCode } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  isLoginDrawerOpen: boolean;
  dbSavedStatus: string | null;
  openLoginDrawer: () => void;
  closeLoginDrawer: () => void;
  loginWithGoogle: (currentLang?: LanguageCode) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserRole: (role: 'farmer' | 'agronomist' | 'gardener') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState<boolean>(false);
  const [dbSavedStatus, setDbSavedStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Read from Firestore database or save if first time
          let profile = await getUserProfileFromDatabase(user.uid);
          if (!profile) {
            profile = await saveUserToDatabase(user);
          }
          setUserProfile(profile);
          setDbSavedStatus(`users/${user.uid}`);
        } catch (err: any) {
          console.error('Error syncing user profile with Firestore:', err);
          setAuthError(err.message || 'Database sync issue');
        }
      } else {
        setUserProfile(null);
        setDbSavedStatus(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openLoginDrawer = () => {
    setAuthError(null);
    setIsLoginDrawerOpen(true);
  };

  const closeLoginDrawer = () => {
    setIsLoginDrawerOpen(false);
  };

  const loginWithGoogle = async (currentLang?: LanguageCode): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save ID and Google account credentials in Firestore database
      const profile = await saveUserToDatabase(user, currentLang || 'en');
      setUserProfile(profile);
      setDbSavedStatus(`users/${user.uid}`);
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      let errorMsg = 'Failed to sign in with Google account.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign-in popup was closed before finishing.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Multiple login popups opened. Please try again.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Network connection problem. Please verify internet access.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      setDbSavedStatus(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (role: 'farmer' | 'agronomist' | 'gardener') => {
    if (!currentUser) return;
    try {
      const updated = await saveUserToDatabase(currentUser, userProfile?.language || 'en', role);
      setUserProfile(updated);
    } catch (err: any) {
      console.error('Failed to update role:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        authError,
        isLoginDrawerOpen,
        dbSavedStatus,
        openLoginDrawer,
        closeLoginDrawer,
        loginWithGoogle,
        logout,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
