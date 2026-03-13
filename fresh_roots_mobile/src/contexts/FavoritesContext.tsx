import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {getFavorites, setFavorites} from '../utils/storage';
import {syncFavorites} from '../services/firebase';
import {useAuth} from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavoritesState] = useState<string[]>([]);
  const {user, isAuthenticated} = useAuth();

  // Load favorites from storage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites to storage and Firestore whenever it changes
  useEffect(() => {
    setFavorites(favorites);
    
    // Sync to Firestore if user is authenticated
    if (isAuthenticated && user?.id) {
      syncFavorites(user.id, favorites).catch(error =>
        console.error('Error syncing favorites to Firestore:', error),
      );
    }
  }, [favorites, isAuthenticated, user]);

  const loadFavorites = async () => {
    const savedFavorites = await getFavorites();
    if (savedFavorites.length > 0) {
      setFavoritesState(savedFavorites);
    }
  };

  const toggleFavorite = (listingId: string) => {
    setFavoritesState(current => {
      if (current.includes(listingId)) {
        return current.filter(id => id !== listingId);
      }
      return [...current, listingId];
    });
  };

  const isFavorite = (listingId: string): boolean => {
    return favorites.includes(listingId);
  };

  const clearFavorites = () => {
    setFavoritesState([]);
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
