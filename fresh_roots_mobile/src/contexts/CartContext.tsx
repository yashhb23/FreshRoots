import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {CartItem, Listing} from '../types';
import {getCart, setCart, clearCart as clearCartStorage} from '../utils/storage';
import {syncCartSummary} from '../services/firebase';
import {useAuth} from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addItem: (listing: Listing, quantity?: number) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
  isInCart: (listingId: string) => boolean;
  getItemQuantity: (listingId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const {user, isAuthenticated} = useAuth();

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage and Firestore whenever it changes
  useEffect(() => {
    setCart(items);
    
    // Sync cart summary to Firestore if user is authenticated
    if (isAuthenticated && user?.id && items.length > 0) {
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce(
        (sum, item) => sum + item.listing.price * item.quantity,
        0,
      );
      
      syncCartSummary(user.id, {
        itemCount,
        totalAmount,
        lastUpdated: new Date(),
      }).catch(error =>
        console.error('Error syncing cart summary to Firestore:', error),
      );
    }
  }, [items, isAuthenticated, user]);

  const loadCart = async () => {
    const savedCart = await getCart();
    if (savedCart.length > 0) {
      setItems(savedCart);
    }
  };

  const addItem = (listing: Listing, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.listing.id === listing.id,
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.listing.id === listing.id
            ? {...item, quantity: item.quantity + quantity}
            : item,
        );
      }

      return [...currentItems, {listing, quantity}];
    });
  };

  const removeItem = (listingId: string) => {
    setItems(currentItems =>
      currentItems.filter(item => item.listing.id !== listingId),
    );
  };

  const updateQuantity = (listingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(listingId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.listing.id === listingId ? {...item, quantity} : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    clearCartStorage();
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.listing.price * item.quantity,
    0,
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isInCart = (listingId: string): boolean => {
    return items.some(item => item.listing.id === listingId);
  };

  const getItemQuantity = (listingId: string): number => {
    const item = items.find(i => i.listing.id === listingId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        itemCount,
        isInCart,
        getItemQuantity,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
