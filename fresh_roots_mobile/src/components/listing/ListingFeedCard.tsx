import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Listing} from '../../types';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {useCart} from '../../contexts/CartContext';
import {useFavorites} from '../../contexts/FavoritesContext';
import {useTheme} from '../../contexts/ThemeContext';

interface ListingFeedCardProps {
  listing: Listing;
  onPress: () => void;
  onMessagePress?: () => void;
}

/**
 * Facebook-style listing card:
 * - Image-first
 * - Strong title + price
 * - Short highlights from description
 * - Clear CTAs (Message / Add to cart)
 */
const ListingFeedCard: React.FC<ListingFeedCardProps> = ({
  listing,
  onPress,
  onMessagePress,
}) => {
  const {addItem} = useCart();
  const {isFavorite, toggleFavorite} = useFavorites();
  const {mode} = useTheme();
  const colors = getColors(mode);

  const favorite = isFavorite(listing.id);
  const imageUrl =
    listing.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1540420773420-3366772f4999';

  const highlights = useMemo(() => {
    const raw = listing.description || '';
    const lines = raw
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
    return lines.slice(0, 4);
  }, [listing.description]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.95}>
      <View style={styles.imageWrap}>
        <Image source={{uri: imageUrl}} style={styles.image} resizeMode="cover" />

        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>Rs {listing.price.toFixed(0)}</Text>
          <Text style={styles.priceBadgeSub}>/{listing.unit}</Text>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(listing.id)}
          activeOpacity={0.8}>
          <Text style={styles.favoriteIcon}>{favorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText} numberOfLines={1}>
            {listing.location ? `📍 ${listing.location}` : '📍 Mauritius'}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {listing.stock > 0 ? `${listing.stock} available` : 'Out of stock'}
          </Text>
        </View>

        {highlights.length > 0 && (
          <View style={styles.highlights}>
            {highlights.map((line, idx) => (
              <View key={`${listing.id}-hl-${idx}`} style={styles.highlightRow}>
                <Text style={styles.highlightBullet}>•</Text>
                <Text style={styles.highlightText} numberOfLines={1}>
                  {line}
                </Text>
              </View>
            ))}
          </View>
        )}

        {Array.isArray(listing.tags) && listing.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {listing.tags.slice(0, 3).map(tag => (
              <View key={`${listing.id}-tag-${tag}`} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={onMessagePress}
            activeOpacity={0.85}>
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cartButton,
              listing.stock <= 0 && styles.cartButtonDisabled,
            ]}
            onPress={() => addItem(listing, 1)}
            disabled={listing.stock <= 0}
            activeOpacity={0.85}>
            <Text style={styles.cartButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.small,
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: 190,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.large,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'baseline',
    ...shadows.small,
  },
  priceBadgeText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '800',
  },
  priceBadgeSub: {
    marginLeft: 4,
    color: colors.textInverse,
    fontSize: 12,
    opacity: 0.9,
  },
  favoriteButton: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  favoriteIcon: {
    fontSize: 18,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metaDot: {
    marginHorizontal: 6,
    color: colors.textLight,
  },
  highlights: {
    marginBottom: spacing.sm,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  highlightBullet: {
    width: 12,
    color: colors.primary,
    fontWeight: '900',
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    opacity: 0.9,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  tagChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  messageButton: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.large,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 14,
  },
  cartButton: {
    width: 90,
    height: 44,
    borderRadius: borderRadius.large,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartButtonText: {
    color: colors.textInverse,
    fontWeight: '800',
    fontSize: 14,
  },
});

export default ListingFeedCard;

