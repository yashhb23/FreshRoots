import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {getColors, spacing} from '../../theme';
import {Listing} from '../../types';
import {listingsService} from '../../services/api';
import {useFavorites} from '../../contexts/FavoritesContext';
import ProductCard from '../../components/listing/ProductCard';
import {useTheme} from '../../contexts/ThemeContext';

const FavoritesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {favorites} = useFavorites();
  const {mode} = useTheme();
  const colors = getColors(mode);
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  const [products, setProducts] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavoriteProducts();
  }, [favorites]);

  const fetchFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch all listings and filter favorites
      const response = await listingsService.getListings({limit: 100});
      if (response.success && response.data) {
        const favoriteProducts = response.data.listings.filter(
          listing => favorites.includes(listing.id),
        );
        setProducts(favoriteProducts);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('HomeTab', {
      screen: 'ProductDetail',
      params: {id: productId},
    });
  };

  const renderProduct = ({item}: {item: Listing}) => (
    <View style={styles.cardWrapper}>
      <ProductCard
        listing={item}
        onPress={() => handleProductPress(item.id)}
      />
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>❤️</Text>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>
          Tap the heart icon on products to save them here
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerCount}>{favorites.length} items</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          numColumns={2}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={products.length === 0 ? styles.emptyList : styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
    paddingHorizontal: spacing.xs,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default FavoritesScreen;
