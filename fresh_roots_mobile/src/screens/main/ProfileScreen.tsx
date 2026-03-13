import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {useAuth} from '../../contexts/AuthContext';
import {ordersService} from '../../services/api';
import {Order} from '../../types';
import {useTheme} from '../../contexts/ThemeContext';

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {user, logout} = useAuth();
  const {mode} = useTheme();
  const colors = getColors(mode);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersService.getMyOrders();
      if (response.success && response.data) {
        setOrders(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ],
    );
  };

  const getStatusColor = (status: Order['order_status']) => {
    switch (status) {
      case 'delivered':
        return colors.success;
      case 'cancelled':
      case 'rejected':
        return colors.error;
      case 'pending':
      case 'payment_pending':
        return colors.warning;
      default:
        return colors.info;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={[styles.container, {paddingTop: insets.top}]}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                user?.name || 'Guest',
              )}`,
            }}
            style={styles.avatarImage}
          />
        </View>
        <Text style={styles.name}>{user?.name || 'Guest'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.phone && <Text style={styles.phone}>{user.phone}</Text>}
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📍</Text>
          <Text style={styles.menuText}>Delivery Address</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate('HomeTab', {screen: 'Messages'})
          }>
          <Text style={styles.menuIcon}>💬</Text>
          <Text style={styles.menuText}>Messages</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Notification Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText}>About Fresh Roots</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Orders Section */}
      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>My Orders</Text>
        
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : orders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        ) : (
          orders.slice(0, 5).map(order => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>
                  #{order.order_number || order.id.slice(0, 8)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(order.order_status) + '20'},
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      {color: getStatusColor(order.order_status)},
                    ]}>
                    {order.order_status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderDate}>
                {formatDate(order.created_at)}
              </Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderItems}>
                  {order.items?.length || 0} items
                </Text>
                <Text style={styles.orderTotal}>
                  Rs {order.total_amount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{height: insets.bottom + spacing.xl}} />
    </ScrollView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  phone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  menuSection: {
    backgroundColor: colors.background,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  ordersSection: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  loader: {
    paddingVertical: spacing.lg,
  },
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItems: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});

export default ProfileScreen;
