import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Listing} from '../../types';
import {colors, spacing, borderRadius, shadows} from '../../theme';
import {useFavorites} from '../../contexts/FavoritesContext';
import {useCart} from '../../contexts/CartContext';

interface ProductCardProps {
  product: Listing;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({product, onPress}) => {
  const {isFavorite, toggleFavorite} = useFavorites();
  const {addItem} = useCart();
  const favorite = isFavorite(product.id);

  const imageUrl = product.images?.[0]?.image_url || 
    'https://images.unsplash.com/photo-1540420773420-3366772f4999';

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}>
          <Text style={styles.favoriteIcon}>{favorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {product.category?.name || 'Fresh'}
        </Text>
        
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>Rs {product.price.toFixed(2)}</Text>
            <Text style={styles.unit}>per {product.unit}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: borderRadius.large,
    ...shadows.small,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  content: {
    padding: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  unit: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textInverse,
  },
});

export default ProductCard;
