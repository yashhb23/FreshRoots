import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
// Web Client ID from your google-services.json oauth_client section
const WEB_CLIENT_ID =
  '620749427733-07sm400f93cg4r8v69mgn0vde2281jc5.apps.googleusercontent.com';

export const configureFirebase = () => {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
  });
};

// Firebase Auth - Anonymous Sign In
export const signInAnonymously = async () => {
  try {
    const userCredential = await auth().signInAnonymously();
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

// Firebase Auth - Google Sign In
export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

  const response = await GoogleSignin.signIn();

  if (response.type === 'cancelled') {
    const err: any = new Error('Sign-in was cancelled');
    err.code = 'SIGN_IN_CANCELLED';
    throw err;
  }

  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error(
      'Google Sign-In did not return an ID token. Check that your SHA-1 fingerprint is registered in Firebase Console.',
    );
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);

  const user = response.data?.user;
  if (!user?.email) {
    throw new Error('Could not retrieve your Google account email.');
  }

  return {
    firebaseUser: userCredential.user,
    googleUser: {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0],
      photo: user.photo ?? undefined,
    },
  };
};

// Firebase Auth - Sign Out
export const signOutFromFirebase = async () => {
  try {
    const isSignedInWithGoogle = await GoogleSignin.isSignedIn();
    if (isSignedInWithGoogle) {
      await GoogleSignin.signOut();
    }
    await auth().signOut();
  } catch (error) {
    console.error('Error signing out from Firebase:', error);
    throw error;
  }
};

// Get current Firebase user
export const getCurrentFirebaseUser = () => {
  return auth().currentUser;
};

// Firestore - User Profile Sync
export const syncUserProfile = async (
  backendUserId: string,
  userData: {
    email: string;
    name: string;
    phone?: string;
    firebaseUid: string;
  },
) => {
  try {
    const userRef = firestore().collection('users').doc(backendUserId);
    await userRef.set(
      {
        ...userData,
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );
  } catch (error) {
    console.error('Error syncing user profile to Firestore:', error);
    throw error;
  }
};

// Firestore - Create User Profile (for new registrations)
export const createUserProfile = async (
  backendUserId: string,
  userData: {
    email: string;
    name: string;
    phone?: string;
    firebaseUid: string;
  },
) => {
  try {
    const userRef = firestore().collection('users').doc(backendUserId);
    await userRef.set({
      ...userData,
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastLoginAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
    throw error;
  }
};

// Firestore - Track User Event
export const trackUserEvent = async (
  backendUserId: string,
  eventType: string,
  eventData?: Record<string, any>,
) => {
  try {
    const eventsRef = firestore()
      .collection('users')
      .doc(backendUserId)
      .collection('events');

    await eventsRef.add({
      type: eventType,
      data: eventData || {},
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error tracking user event:', error);
    // Don't throw - event tracking should not block user actions
  }
};

// Firestore - Sync Favorites
export const syncFavorites = async (
  backendUserId: string,
  listingIds: string[],
) => {
  try {
    const favoritesRef = firestore()
      .collection('users')
      .doc(backendUserId)
      .collection('favorites')
      .doc('listings');

    await favoritesRef.set({
      items: listingIds,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error syncing favorites:', error);
  }
};

// Firestore - Get Favorites
export const getFavorites = async (
  backendUserId: string,
): Promise<string[]> => {
  try {
    const favoritesRef = firestore()
      .collection('users')
      .doc(backendUserId)
      .collection('favorites')
      .doc('listings');

    const doc = await favoritesRef.get();
    return doc.exists ? doc.data()?.items || [] : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Firestore - Sync Cart Summary (lightweight)
export const syncCartSummary = async (
  backendUserId: string,
  cartData: {
    itemCount: number;
    totalAmount: number;
    lastUpdated: Date;
  },
) => {
  try {
    const cartRef = firestore()
      .collection('users')
      .doc(backendUserId)
      .collection('cart')
      .doc('summary');

    await cartRef.set({
      ...cartData,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error syncing cart summary:', error);
  }
};

export {auth, firestore};
