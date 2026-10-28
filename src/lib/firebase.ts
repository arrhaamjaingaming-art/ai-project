import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile } from '../types';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore using the provisioned custom database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Google Auth Provider setup
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Saves authenticated Google user record directly into Firestore database at `users/{userId}`.
 * Preserves initial registration date and records Google Provider ID and Auth UID.
 */
export async function saveUserToDatabase(
  firebaseUser: FirebaseUser,
  language = 'en',
  role: 'farmer' | 'agronomist' | 'gardener' = 'farmer'
): Promise<UserProfile> {
  // Extract Google Provider Account ID
  const googleAccount = firebaseUser.providerData.find(
    (p) => p.providerId === 'google.com'
  );
  const googleId = googleAccount?.uid || firebaseUser.uid;

  const userRef = doc(db, 'users', firebaseUser.uid);
  
  let createdAt = new Date().toISOString();
  try {
    const existingSnap = await getDoc(userRef);
    if (existingSnap.exists()) {
      const data = existingSnap.data();
      if (data.createdAt) {
        createdAt = data.createdAt;
      }
    }
  } catch (err) {
    console.warn('Could not read existing user record:', err);
  }

  const userProfile: UserProfile = {
    id: firebaseUser.uid,
    googleId: googleId,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || 'Farmer Member',
    photoURL: firebaseUser.photoURL || undefined,
    role: role,
    language: language,
    createdAt: createdAt,
    lastLoginAt: new Date().toISOString(),
  };

  await setDoc(
    userRef,
    {
      ...userProfile,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return userProfile;
}

/**
 * Reads user profile from Firestore `users/{uid}`
 */
export async function getUserProfileFromDatabase(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.error('Failed to retrieve user profile from database:', err);
  }
  return null;
}

export { signInWithPopup, firebaseSignOut, onAuthStateChanged };
export type { FirebaseUser };
