import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthTokens, User, CartItem, LocalNotification, MessageThread} from '../types';

// Storage keys
const KEYS = {
  ACCESS_TOKEN: '@fresh_roots:access_token',
  REFRESH_TOKEN: '@fresh_roots:refresh_token',
  USER: '@fresh_roots:user',
  CART: '@fresh_roots:cart',
  FAVORITES: '@fresh_roots:favorites',
  NOTIFICATIONS: '@fresh_roots:notifications',
  MESSAGES: '@fresh_roots:messages',
};

/**
 * Local chat message shape (demo-only, stored on device).
 */
export type LocalMessage = {
  id: string;
  threadId: string;
  sender: 'user' | 'vendor';
  text: string;
  createdAt: string;
};

const threadMessagesKey = (threadId: string) =>
  `@fresh_roots:messages:thread:${threadId}`;

// Token management
export const getTokens = async (): Promise<AuthTokens | null> => {
  try {
    const accessToken = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    const refreshToken = await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
    
    if (accessToken && refreshToken) {
      return {accessToken, refreshToken};
    }
    return null;
  } catch (error) {
    console.error('Error getting tokens:', error);
    return null;
  }
};

export const setTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [KEYS.ACCESS_TOKEN, tokens.accessToken],
      [KEYS.REFRESH_TOKEN, tokens.refreshToken],
    ]);
  } catch (error) {
    console.error('Error setting tokens:', error);
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// User management
export const getUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const setUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error setting user:', error);
  }
};

export const clearUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
  } catch (error) {
    console.error('Error clearing user:', error);
  }
};

// Cart management
export const getCart = async (): Promise<CartItem[]> => {
  try {
    const cartJson = await AsyncStorage.getItem(KEYS.CART);
    return cartJson ? JSON.parse(cartJson) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

export const setCart = async (cart: CartItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart));
  } catch (error) {
    console.error('Error setting cart:', error);
  }
};

export const clearCart = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.CART);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

// Favorites management
export const getFavorites = async (): Promise<string[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(KEYS.FAVORITES);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const setFavorites = async (favorites: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error setting favorites:', error);
  }
};

// Notifications management (local only)
export const getNotifications = async (): Promise<LocalNotification[]> => {
  try {
    const notificationsJson = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
    return notificationsJson ? JSON.parse(notificationsJson) : [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

export const setNotifications = async (notifications: LocalNotification[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error setting notifications:', error);
  }
};

export const addNotification = async (notification: Omit<LocalNotification, 'id' | 'timestamp' | 'read'>): Promise<void> => {
  try {
    const notifications = await getNotifications();
    const newNotification: LocalNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    await setNotifications([newNotification, ...notifications]);
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};

// Messages management (local only for now)
export const getMessageThreads = async (): Promise<MessageThread[]> => {
  try {
    const threadsJson = await AsyncStorage.getItem(KEYS.MESSAGES);
    return threadsJson ? JSON.parse(threadsJson) : [];
  } catch (error) {
    console.error('Error getting message threads:', error);
    return [];
  }
};

export const setMessageThreads = async (threads: MessageThread[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.MESSAGES, JSON.stringify(threads));
  } catch (error) {
    console.error('Error setting message threads:', error);
  }
};

export const upsertMessageThread = async (thread: Omit<MessageThread, 'updatedAt'>): Promise<void> => {
  try {
    const threads = await getMessageThreads();
    const updatedAt = new Date().toISOString();
    const updatedThreads = [
      {
        ...thread,
        updatedAt,
      },
      ...threads.filter(t => t.id !== thread.id),
    ];
    await setMessageThreads(updatedThreads);
  } catch (error) {
    console.error('Error upserting message thread:', error);
  }
};

/**
 * Get messages for a given thread (demo-only).
 */
export const getThreadMessages = async (threadId: string): Promise<LocalMessage[]> => {
  try {
    const raw = await AsyncStorage.getItem(threadMessagesKey(threadId));
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error getting thread messages:', error);
    return [];
  }
};

/**
 * Append a message to a thread and keep the thread preview in sync.
 */
export const appendThreadMessage = async (
  threadId: string,
  input: Pick<LocalMessage, 'sender' | 'text'>,
): Promise<void> => {
  try {
    const existing = await getThreadMessages(threadId);
    const next: LocalMessage = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      threadId,
      sender: input.sender,
      text: input.text,
      createdAt: new Date().toISOString(),
    };
    const updated = [...existing, next];
    await AsyncStorage.setItem(threadMessagesKey(threadId), JSON.stringify(updated));

    // Update thread preview (best-effort).
    const threads = await getMessageThreads();
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      await upsertMessageThread({
        id: thread.id,
        title: thread.title,
        listingId: thread.listingId,
        lastMessage: next.text,
      });
    }
  } catch (error) {
    console.error('Error appending thread message:', error);
  }
};

/**
 * Seed a thread with an initial message + demo vendor reply if empty.
 */
export const ensureSeedThreadMessages = async (
  threadId: string,
  initialUserMessage?: string,
): Promise<void> => {
  try {
    const existing = await getThreadMessages(threadId);
    if (existing.length > 0) return;

    const firstText = initialUserMessage?.trim() || "Hi! I'm interested.";
    const seed: LocalMessage[] = [
      {
        id: `${Date.now()}-seed-user`,
        threadId,
        sender: 'user',
        text: firstText,
        createdAt: new Date().toISOString(),
      },
      {
        id: `${Date.now()}-seed-vendor`,
        threadId,
        sender: 'vendor',
        text: 'Hi! Thanks for reaching out — how can I help?',
        createdAt: new Date(Date.now() + 250).toISOString(),
      },
    ];
    await AsyncStorage.setItem(threadMessagesKey(threadId), JSON.stringify(seed));
  } catch (error) {
    console.error('Error seeding thread messages:', error);
  }
};

// Clear all app data (on logout)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
      KEYS.USER,
      KEYS.CART,
      KEYS.FAVORITES,
      KEYS.NOTIFICATIONS,
      KEYS.MESSAGES,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
