import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HomeScreenNavigationProp} from '../../navigation/types';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {Listing, Category} from '../../types';
import {listingsService} from '../../services/api';
import {parseApiError, ApiError} from '../../services/api/client';
import {useCart} from '../../contexts/CartContext';
import {useAuth} from '../../contexts/AuthContext';
import ProductCard from '../../components/listing/ProductCard';
import CategoryChip from '../../components/common/CategoryChip';
import NetworkError from '../../components/common/NetworkErrorBoundary';
import {useTheme} from '../../contexts/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {user} = useAuth();
  const {itemCount} = useCart();
  const {mode} = useTheme();
  const colors = getColors(mode);

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchListings(true);
  }, [selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchListings(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await listingsService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchListings = async (reset = false) => {
    if (!hasMore && !reset) return;
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      }
      const currentPage = reset ? 1 : page;
      const response = await listingsService.getListings({
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
      });
      if (response.success && response.data) {
        const newListings = response.data.listings || [];
        if (reset) {
          setListings(newListings);
        } else {
          setListings(prev => [...prev, ...newListings]);
        }
        const pagination = response.data.pagination;
        setHasMore(pagination ? currentPage < pagination.totalPages : false);
        setPage(currentPage + 1);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      const apiError = parseApiError(err);
      setError(apiError);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchListings(true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchListings(false);
    }
  };

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetail', {id: productId});
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(current =>
      current === categoryId ? null : categoryId,
    );
  };

  const userName = user?.name?.split(' ')[0] || 'Guest';
  const userInitial = userName.charAt(0).toUpperCase();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderHeader = () => (
    <View>
      {/* Green Header Banner */}
      <View style={[styles.headerBanner, {paddingTop: insets.top + spacing.sm}]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.deliveryLabel}>
              <Icon name="map-marker" size={14} color="rgba(255,255,255,0.8)" />
              {'  '}Delivery to
            </Text>
            <Text style={styles.locationText}>Fresh Roots, Mauritius</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={22} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Grocery"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Icon name="tune-variant" size={20} color={colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Promo Banner */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promoBannerContainer}
        style={styles.promoScroll}>
        <View style={[styles.promoBanner, {backgroundColor: colors.promoAccent}]}>
          <View style={styles.promoTextBlock}>
            <Text style={styles.promoTagline}>Hurry Up! Fresh Deals</Text>
            <Text style={styles.promoTitle}>
              Fresh produce{'\n'}everyday from{'\n'}FreshRoots
            </Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoEmoji}>🍌</Text>
        </View>
        <View style={[styles.promoBanner, {backgroundColor: colors.promoBg}]}>
          <View style={styles.promoTextBlock}>
            <Text style={styles.promoTagline}>Farm to Table</Text>
            <Text style={styles.promoTitle}>
              Organic &{'\n'}locally grown{'\n'}vegetables
            </Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Explore</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoEmoji}>🥬</Text>
        </View>
      </ScrollView>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <CategoryChip
            category={item}
            selected={selectedCategory === item.id}
            onPress={() => handleCategoryPress(item.id)}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {/* Popular Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProduct = ({item, index}: {item: Listing; index: number}) => (
    <View
      style={[
        styles.cardWrapper,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}>
      <ProductCard
        listing={item}
        onPress={() => handleProductPress(item.id)}
      />
    </View>
  );

  const renderFooter = () => {
    if (!hasMore || listings.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    if (error) {
      return (
        <NetworkError
          type={
            error.type === 'offline'
              ? 'offline'
              : error.type === 'server'
                ? 'server'
                : error.type === 'timeout'
                  ? 'timeout'
                  : 'network'
          }
          message={error.message}
          onRetry={() => fetchListings(true)}
        />
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🥬</Text>
        <Text style={styles.emptyTitle}>No products found</Text>
        <Text style={styles.emptyText}>
          Try adjusting your search or filters
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && listings.length === 0 ? (
        <View style={[styles.loadingContainer, {paddingTop: insets.top}]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading fresh produce...</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: spacing.md,
      color: colors.textSecondary,
    },
    listContent: {
      paddingBottom: 80,
    },

    /* ── Header Banner ── */
    headerBanner: {
      backgroundColor: colors.headerBg,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.lg,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flex: 1,
    },
    deliveryLabel: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: 4,
    },
    locationText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.4)',
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },

    /* ── Search ── */
    searchSection: {
      paddingHorizontal: spacing.md,
      marginTop: -22,
      marginBottom: spacing.md,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.xl,
      paddingHorizontal: spacing.md,
      height: 48,
      ...shadows.medium,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      marginLeft: spacing.sm,
    },
    filterBtn: {
      width: 34,
      height: 34,
      borderRadius: borderRadius.medium,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    /* ── Promo Banner ── */
    promoScroll: {
      marginBottom: spacing.md,
    },
    promoBannerContainer: {
      paddingHorizontal: spacing.md,
    },
    promoBanner: {
      width: SCREEN_WIDTH * 0.72,
      borderRadius: borderRadius.xl,
      padding: spacing.md,
      marginRight: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      minHeight: 140,
    },
    promoTextBlock: {
      flex: 1,
    },
    promoTagline: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 4,
    },
    promoTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
      lineHeight: 20,
      marginBottom: spacing.sm,
    },
    promoButton: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: borderRadius.round,
    },
    promoButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textInverse,
    },
    promoEmoji: {
      fontSize: 64,
      marginLeft: spacing.sm,
    },

    /* ── Categories ── */
    categoriesContainer: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },

    /* ── Section Header ── */
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
    },
    viewAll: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },

    /* ── Grid ── */
    columnWrapper: {
      paddingHorizontal: spacing.md,
      justifyContent: 'space-between',
    },
    cardWrapper: {
      flex: 1,
      maxWidth: '49%',
    },
    cardLeft: {
      marginRight: spacing.sm / 2,
    },
    cardRight: {
      marginLeft: spacing.sm / 2,
    },

    /* ── Empty / Footer ── */
    footerLoader: {
      paddingVertical: spacing.lg,
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: spacing.md,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

export default HomeScreen;
