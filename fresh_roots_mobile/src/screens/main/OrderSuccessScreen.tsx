import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp, useRoute} from '@react-navigation/native';
import {HomeStackParamList} from '../../navigation/types';
import {colors, spacing, borderRadius} from '../../theme';
import Button from '../../components/common/Button';

type OrderSuccessRouteProp = RouteProp<HomeStackParamList, 'OrderSuccess'>;

interface Props {
  navigation: any;
}

const OrderSuccessScreen: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const route = useRoute<OrderSuccessRouteProp>();
  const orderId = route.params?.orderId;

  const handleViewOrders = () => {
    // Navigate to profile tab which has orders
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✅</Text>
        </View>
        
        <Text style={styles.title}>Order Placed!</Text>
        
        <Text style={styles.message}>
          Mersi! Your order has been received and will be processed soon.
        </Text>
        
        {orderId && (
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order ID</Text>
            <Text style={styles.orderId}>{orderId.slice(0, 8)}...</Text>
          </View>
        )}
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What's Next?</Text>
          <Text style={styles.infoText}>
            • We'll contact you to confirm delivery details{'\n'}
            • Track your order status in the Profile tab{'\n'}
            • Payment on delivery (if COD selected)
          </Text>
        </View>
      </View>

      <View style={[styles.bottomSection, {paddingBottom: insets.bottom + spacing.md}]}>
        <Button
          title="View My Orders"
          variant="outline"
          onPress={handleViewOrders}
          fullWidth
          style={styles.viewOrdersButton}
        />
        <Button
          title="Continue Shopping"
          onPress={handleContinueShopping}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  orderIdContainer: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  infoBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.large,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  bottomSection: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewOrdersButton: {
    marginBottom: spacing.sm,
  },
});

export default OrderSuccessScreen;
