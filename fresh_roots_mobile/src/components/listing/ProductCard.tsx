import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Listing} from '../../types';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {useCart} from '../../contexts/CartContext';
import {useTheme} from '../../contexts/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = spacing.sm;
const CARD_HORIZONTAL_PADDING = spacing.md;
const CARD_WIDTH =
  (SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

interface ProductCardProps {
  listing: Listing;
  onPress: () => void;
}

/**
 * Compact product card for 2-column grid layout.
 * Shows badge, image, name, unit, price, and quick-add button.
 */
const ProductCard: React.FC<ProductCardProps> = ({listing, onPress}) => {
  const {addItem} = useCart();
  const {mode} = useTheme();
  const colors = getColors(mode);

  const imageUrl =
    listing.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1540420773420-3366772f4999';

  const badgeText =
    listing.tags?.[0] || (listing.stock > 0 ? 'Fresh' : 'Out of stock');

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}>
      {/* Badge */}
      <View
        style={[
          styles.badge,
          {backgroundColor: listing.stock > 0 ? colors.primary : colors.error},
        ]}>
        <Text style={styles.badgeText} numberOfLines={1}>
          {badgeText}
        </Text>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.unit} numberOfLines={1}>
          {listing.unit}
        </Text>

        {/* Price + Add Button */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs {listing.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              listing.stock <= 0 && styles.addButtonDisabled,
            ]}
            onPress={() => addItem(listing, 1)}
            disabled={listing.stock <= 0}
            activeOpacity={0.8}>
            <Icon
              name="plus"
              size={18}
              color={listing.stock > 0 ? colors.textInverse : colors.textLight}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.xl,
      marginBottom: CARD_GAP,
      overflow: 'hidden',
      ...shadows.small,
    },
    badge: {
      position: 'absolute',
      top: spacing.sm,
      left: spacing.sm,
      zIndex: 2,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: borderRadius.small,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.textInverse,
    },
    imageContainer: {
      width: '100%',
      height: CARD_WIDTH * 0.72,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      paddingTop: spacing.lg,
      paddingHorizontal: spacing.sm,
    },
    image: {
      width: '80%',
      height: '90%',
    },
    info: {
      padding: spacing.sm,
      paddingTop: spacing.xs,
    },
    name: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },
    unit: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    price: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.primary,
    },
    addButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.small,
    },
    addButtonDisabled: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });

export default ProductCard;
