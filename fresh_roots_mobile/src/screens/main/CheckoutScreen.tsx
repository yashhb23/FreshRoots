import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {useCart} from '../../contexts/CartContext';
import {useAuth} from '../../contexts/AuthContext';
import {ordersService} from '../../services/api';
import Button from '../../components/common/Button';
import {useTheme} from '../../contexts/ThemeContext';

interface Props {
  navigation: any;
}

type PaymentMethod = 'cash_on_delivery' | 'juice';

const CheckoutScreen: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {items, totalAmount, clearCart} = useCart();
  const {user, isAuthenticated, isGuest, logout} = useAuth();
  const {mode} = useTheme();
  const colors = getColors(mode);
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || isGuest) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to place an order.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Sign In',
            onPress: async () => {
              try {
                await logout();
              } catch (_) {
                // logout resets auth state; RootNavigator auto-shows Auth
              }
            },
          },
        ],
      );
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = items.map(item => ({
        listing_id: item.listing.id,
        quantity: item.quantity,
      }));

      const response = await ordersService.createOrder({
        items: orderItems,
        payment_method: paymentMethod,
      });

      if (response.success && response.data) {
        clearCart();
        navigation.replace('OrderSuccess', {orderId: response.data.id});
      }
    } catch (error: any) {
      console.error('Order error:', error);
      Alert.alert(
        'Order Failed',
        error.message || 'Failed to place order. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{width: 50}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoName}>{user?.name || 'Guest'}</Text>
            <Text style={styles.infoText}>{user?.email}</Text>
            {user?.phone && <Text style={styles.infoText}>{user.phone}</Text>}
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash_on_delivery' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash_on_delivery')}>
            <View style={styles.radioOuter}>
              {paymentMethod === 'cash_on_delivery' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.paymentIcon}>💵</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Cash on Delivery</Text>
              <Text style={styles.paymentDesc}>Pay when you receive</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'juice' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('juice')}>
            <View style={styles.radioOuter}>
              {paymentMethod === 'juice' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.paymentIcon}>📱</Text>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Juice Payment</Text>
              <Text style={styles.paymentDesc}>Pay with MCB Juice</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary ({items.length} items)</Text>
          <View style={styles.summaryCard}>
            {items.map(item => (
              <View key={item.listing.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {item.listing.title} x {item.quantity}
                </Text>
                <Text style={styles.summaryItemPrice}>
                  Rs {(item.listing.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            
            <View style={styles.divider} />
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rs {totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryItem}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>Rs {totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.bottomSection, {paddingBottom: Math.max(insets.bottom, 20) + spacing.md}]}>
        <Button
          title={`Place Order • Rs ${totalAmount.toFixed(2)}`}
          onPress={handlePlaceOrder}
          loading={isSubmitting}
          disabled={isSubmitting || items.length === 0}
          fullWidth
        />
      </View>
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
    scrollContent: {
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: spacing.md,
    },
    infoCard: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.large,
      padding: spacing.md,
      ...shadows.small,
    },
    infoName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    editButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
    },
    editText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: borderRadius.large,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
      ...shadows.small,
    },
    paymentOptionSelected: {
      borderColor: colors.primary,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    paymentIcon: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    paymentInfo: {
      flex: 1,
    },
    paymentTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    paymentDesc: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    summaryCard: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.large,
      padding: spacing.md,
      ...shadows.small,
    },
    summaryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    summaryItemName: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      marginRight: spacing.md,
    },
    summaryItemPrice: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.sm,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    summaryValue: {
      fontSize: 14,
      color: colors.text,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
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
  });

export default CheckoutScreen;
