import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {useCart} from '../../contexts/CartContext';
import {CartItem} from '../../types';
import Button from '../../components/common/Button';
import {useTheme} from '../../contexts/ThemeContext';
import {upsertMessageThread} from '../../utils/storage';

interface Props {
  navigation: any;
}

const CartScreen: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {items, updateQuantity, removeItem, totalAmount, clearCart} = useCart();
  const {mode} = useTheme();
  const colors = getColors(mode);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleMessageSeller = async () => {
    const firstItem = items[0];
    const sellerName = firstItem?.listing?.admin?.name || 'Fresh Roots Seller';
    const itemNames = items.map(i => i.listing.title).join(', ');

    await upsertMessageThread({
      id: 'seller-cart',
      title: sellerName,
      listingId: firstItem?.listing?.id,
      lastMessage: `Hi! I have questions about: ${itemNames}`,
    });
    navigation.navigate('Chat', {threadId: 'seller-cart'});
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: clearCart},
      ],
    );
  };

  const renderCartItem = ({item}: {item: CartItem}) => {
    const imageUrl = item.listing.images?.[0]?.image_url ||
      'https://images.unsplash.com/photo-1540420773420-3366772f4999';

    return (
      <View style={styles.cartItem}>
        <Image source={{uri: imageUrl}} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.listing.title}
          </Text>
          <Text style={styles.itemPrice}>
            Rs {item.listing.price.toFixed(2)} / {item.listing.unit}
          </Text>
          
          <View style={styles.itemActions}>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.listing.id, item.quantity - 1)}>
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.listing.id, item.quantity + 1)}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.itemSubtotal}>
              Rs {(item.listing.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(item.listing.id)}>
          <Text style={styles.removeIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptyText}>
        Browse our fresh vegetables and add items to your cart
      </Text>
      <Button
        title="Start Shopping"
        onPress={() => navigation.navigate('Home')}
        style={styles.shopButton}
      />
    </View>
  );

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items */}
      <FlatList
        data={items}
        keyExtractor={item => item.listing.id}
        renderItem={renderCartItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={items.length === 0 ? styles.emptyList : styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Summary */}
      {items.length > 0 && (
        <View style={[styles.bottomSection, {paddingBottom: Math.max(insets.bottom, 20) + spacing.md}]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs {totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs {totalAmount.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.messageSellerButton}
            onPress={handleMessageSeller}
            activeOpacity={0.7}>
            <Icon
              name="message-text"
              size={20}
              color={colors.primary}
              style={styles.messageSellerIcon}
            />
            <Text style={styles.messageSellerText}>Message Seller</Text>
          </TouchableOpacity>

          <Button
            title="Proceed to Checkout"
            onPress={handleCheckout}
            fullWidth
            style={styles.checkoutButton}
          />
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    clearText: {
      fontSize: 14,
      color: colors.error,
      fontWeight: '600',
    },
    listContent: {
      padding: spacing.md,
    },
    emptyList: {
      flex: 1,
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.large,
      padding: spacing.sm,
      marginBottom: spacing.md,
      ...shadows.small,
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.medium,
      backgroundColor: colors.border,
    },
    itemDetails: {
      flex: 1,
      marginLeft: spacing.md,
      justifyContent: 'space-between',
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    itemPrice: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    quantitySelector: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceAlt,
      borderRadius: borderRadius.medium,
      padding: spacing.xs,
    },
    quantityButton: {
      width: 28,
      height: 28,
      borderRadius: borderRadius.small,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primary,
    },
    quantityText: {
      fontSize: 14,
      fontWeight: '600',
      marginHorizontal: spacing.sm,
      minWidth: 20,
      textAlign: 'center',
      color: colors.text,
    },
    itemSubtotal: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
    removeButton: {
      padding: spacing.xs,
    },
    removeIcon: {
      fontSize: 18,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    emptyIcon: {
      fontSize: 80,
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
      marginBottom: spacing.lg,
    },
    shopButton: {
      paddingHorizontal: spacing.xl,
    },
    bottomSection: {
      backgroundColor: colors.background,
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: -3},
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    summaryValue: {
      fontSize: 14,
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.sm,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
    },
    messageSellerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      borderRadius: borderRadius.large,
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: colors.background,
      marginTop: spacing.md,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    messageSellerIcon: {
      marginRight: spacing.sm,
    },
    messageSellerText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    checkoutButton: {
      marginTop: spacing.sm,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
  });

export default CartScreen;
