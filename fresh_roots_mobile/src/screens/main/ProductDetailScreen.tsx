import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HomeStackParamList} from '../../navigation/types';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {Listing} from '../../types';
import {listingsService, interestService} from '../../services/api';
import {useCart} from '../../contexts/CartContext';
import {useFavorites} from '../../contexts/FavoritesContext';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';
import Button from '../../components/common/Button';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

interface Props {
  navigation: any;
}

const ProductDetailScreen: React.FC<Props> = ({navigation}) => {
  const route = useRoute<ProductDetailRouteProp>();
  const insets = useSafeAreaInsets();
  const {addItem, itemCount} = useCart();
  const {isFavorite, toggleFavorite} = useFavorites();
  const {isAuthenticated, isGuest, logout} = useAuth();
  const {mode} = useTheme();
  const colors = getColors(mode);

  const [product, setProduct] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productId = route.params.id;

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await listingsService.getListing(productId);
      if (response.success && response.data) {
        setProduct(response.data);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      Alert.alert(
        'Added to Cart',
        `${quantity} x ${product.title} added to cart`,
      );
    }
  };

  const handleExpressInterest = async () => {
    if (!product) return;
    if (!isAuthenticated || isGuest) {
      Alert.alert('Sign In Required', 'Please sign in to express interest.', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign In',
          onPress: async () => {
            try {
              await logout();
            } catch (_) {}
          },
        },
      ]);
      return;
    }
    setIsSubmitting(true);
    try {
      await interestService.expressInterest({
        listing_id: product.id,
        message: interestMessage || undefined,
      });
      setShowInterestModal(false);
      setInterestMessage('');
      Alert.alert(
        'Interest Submitted',
        'Mersi! The seller will contact you soon about this product.',
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to submit interest. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) setQuantity(q => q + 1);
  };
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const styles = useMemo(() => createStyles(colors), [colors]);

  if (isLoading) {
    return (
      <View style={[styles.centered, {paddingTop: insets.top}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.centered, {paddingTop: insets.top}]}>
        <Text style={styles.errorText}>Product not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const imageUrl =
    product.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1540420773420-3366772f4999';
  const favorite = isFavorite(product.id);
  const badgeText = product.tags?.[0] || 'Fresh';
  const subtotal = product.price * quantity;
  const descText =
    product.description ||
    `Discover the freshness and nutritional powerhouse of our premium quality ${product.title}. Each item is handpicked to ensure you receive only the finest produce.`;

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={22} color={colors.text} />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Image Area */}
        <View style={styles.imageArea}>
          <Image
            source={{uri: imageUrl}}
            style={styles.productImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => toggleFavorite(product.id)}>
            <Icon
              name={favorite ? 'heart' : 'heart-outline'}
              size={22}
              color={favorite ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.title}</Text>
          <Text style={styles.productUnit}>{product.unit}</Text>

          {/* Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          </View>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs {product.price.toFixed(2)}</Text>
            <View style={styles.deliveryTag}>
              <Icon name="truck-fast" size={14} color={colors.primary} />
              <Text style={styles.deliveryText}>Free delivery</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={decrementQuantity}>
                <Icon name="minus" size={18} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={incrementQuantity}>
                <Icon name="plus" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Icon name="clock-outline" size={16} color={colors.secondary} />
            <Text style={styles.infoBannerText}>
              📦 In Stock: {product.stock} {product.unit}
              {product.location ? ` · 📍 ${product.location}` : ''}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Description</Text>
            <Text
              style={styles.descBody}
              numberOfLines={descExpanded ? undefined : 3}>
              {descText}
            </Text>
            <TouchableOpacity onPress={() => setDescExpanded(v => !v)}>
              <Text style={styles.readMore}>
                {descExpanded ? 'Show less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {product.tags.map((tag, i) => (
                <View key={i} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Express Interest */}
          <TouchableOpacity
            style={styles.interestBtn}
            onPress={() => setShowInterestModal(true)}>
            <Icon name="hand-wave-outline" size={18} color={colors.primary} />
            <Text style={styles.interestBtnText}>Express Interest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Add-to-Cart Bar */}
      <View
        style={[
          styles.bottomBar,
          {paddingBottom: Math.max(insets.bottom, 16) + spacing.sm},
        ]}>
        <View style={styles.subtotalBlock}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalPrice}>Rs {subtotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            product.stock <= 0 && {backgroundColor: colors.textLight},
          ]}
          onPress={handleAddToCart}
          disabled={product.stock <= 0}
          activeOpacity={0.85}>
          <Icon name="cart-plus" size={20} color={colors.textInverse} />
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>

      {/* Interest Modal */}
      <Modal
        visible={showInterestModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInterestModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Express Interest</Text>
            <Text style={styles.modalSubtitle}>
              Leave a message for the seller (optional)
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., I'm interested in bulk orders..."
              placeholderTextColor={colors.textLight}
              value={interestMessage}
              onChangeText={setInterestMessage}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowInterestModal(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Submit"
                onPress={handleExpressInterest}
                loading={isSubmitting}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
    },

    /* ── Header ── */
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      height: 52,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    cartBadge: {
      position: 'absolute',
      top: 2,
      right: 2,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.error,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartBadgeText: {
      fontSize: 9,
      fontWeight: '700',
      color: '#FFF',
    },

    scrollContent: {
      paddingBottom: spacing.lg,
    },

    /* ── Image ── */
    imageArea: {
      height: 280,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    productImage: {
      width: '70%',
      height: '85%',
    },
    favButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.small,
    },

    /* ── Info ── */
    infoSection: {
      padding: spacing.lg,
    },
    productName: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    productUnit: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    badgeRow: {
      flexDirection: 'row',
      marginBottom: spacing.md,
    },
    badge: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.small,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textInverse,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    price: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.primary,
    },
    deliveryTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.promoAccent,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.round,
    },
    deliveryText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: 4,
    },

    /* ── Quantity ── */
    quantityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    quantityLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    quantitySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.large,
      padding: 4,
    },
    qtyBtn: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.medium,
      backgroundColor: colors.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyValue: {
      fontSize: 16,
      fontWeight: '700',
      marginHorizontal: spacing.md,
      color: colors.text,
    },

    /* ── Info Banner ── */
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.promoBg,
      borderRadius: borderRadius.large,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    infoBannerText: {
      flex: 1,
      fontSize: 13,
      color: colors.text,
      marginLeft: spacing.sm,
    },

    /* ── Description ── */
    descSection: {
      marginBottom: spacing.lg,
    },
    descTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.sm,
    },
    descBody: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
    },
    readMore: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      marginTop: spacing.xs,
    },

    /* ── Tags ── */
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing.lg,
    },
    tagChip: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.round,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    tagText: {
      fontSize: 12,
      color: colors.textSecondary,
    },

    /* ── Express Interest ── */
    interestBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderRadius: borderRadius.large,
      borderWidth: 1.5,
      borderColor: colors.primary,
      marginBottom: spacing.md,
    },
    interestBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: spacing.sm,
    },

    /* ── Bottom Bar ── */
    bottomBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      ...shadows.large,
    },
    subtotalBlock: {
      flex: 1,
    },
    subtotalLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    subtotalPrice: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.primary,
    },
    addToCartBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      height: 50,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.large,
      ...shadows.medium,
    },
    addToCartText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textInverse,
      marginLeft: spacing.sm,
    },

    /* ── Modal ── */
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      padding: spacing.lg,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      padding: spacing.md,
      fontSize: 14,
      color: colors.text,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: spacing.md,
      backgroundColor: colors.surface,
    },
    modalButtons: {
      flexDirection: 'row',
    },
    modalBtn: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
  });

export default ProductDetailScreen;
