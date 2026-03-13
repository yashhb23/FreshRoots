import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, spacing, borderRadius, shadows} from '../../theme';
import {LocalNotification} from '../../types';
import {getNotifications, setNotifications} from '../../utils/storage';

const NotificationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [notifications, setLocalNotifications] = useState<LocalNotification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const saved = await getNotifications();
    setLocalNotifications(saved);
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map(n =>
      n.id === id ? {...n, read: true} : n,
    );
    setLocalNotifications(updated);
    await setNotifications(updated);
  };

  const clearAll = async () => {
    setLocalNotifications([]);
    await setNotifications([]);
  };

  const getIcon = (type: LocalNotification['type']) => {
    switch (type) {
      case 'order_created':
        return '🛒';
      case 'interest_sent':
        return '💚';
      case 'order_updated':
        return '📦';
      default:
        return '🔔';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  };

  const renderNotification = ({item}: {item: LocalNotification}) => (
    <TouchableOpacity
      style={[styles.notification, !item.read && styles.notificationUnread]}
      onPress={() => markAsRead(item.id)}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getIcon(item.type)}</Text>
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>{formatTime(item.timestamp)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔔</Text>
      <Text style={styles.emptyTitle}>No notifications yet</Text>
      <Text style={styles.emptyText}>
        You'll receive notifications about your orders and interests here
      </Text>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadText}>{unreadCount} unread</Text>
          )}
        </View>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyList : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  unreadText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
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
  notification: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  notificationUnread: {
    backgroundColor: '#F0FFF4',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textLight,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
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

export default NotificationsScreen;
