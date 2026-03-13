// Jest setup for React Native (native modules mocks)

// Gesture handler
import 'react-native-gesture-handler/jestSetup';

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Firebase (mock native modules + ESM packages)
jest.mock('@react-native-firebase/auth', () => {
  const authFn = () => ({
    currentUser: {uid: 'test-firebase-uid'},
    signInAnonymously: jest.fn(async () => ({user: {uid: 'test-firebase-uid'}})),
    signInWithCredential: jest.fn(async () => ({user: {uid: 'test-firebase-uid'}})),
    signOut: jest.fn(async () => undefined),
  });
  authFn.GoogleAuthProvider = {
    credential: jest.fn(() => ({})),
  };
  return authFn;
});

jest.mock('@react-native-firebase/firestore', () => {
  const serverTimestamp = jest.fn(() => new Date());
  const collection = jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(async () => undefined),
      get: jest.fn(async () => ({exists: false, data: () => ({})})),
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          set: jest.fn(async () => undefined),
          get: jest.fn(async () => ({exists: false, data: () => ({})})),
        })),
        add: jest.fn(async () => undefined),
      })),
    })),
  }));
  const firestoreFn = () => ({collection});
  firestoreFn.FieldValue = {serverTimestamp};
  return firestoreFn;
});

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(async () => true),
    signIn: jest.fn(async () => ({data: {idToken: 'test', user: {}}})),
    isSignedIn: jest.fn(async () => false),
    signOut: jest.fn(async () => undefined),
  },
}));

// Vector icons (avoid ESM parsing in jest)
jest.mock('react-native-vector-icons/Feather', () => 'Feather');

