import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {getMessageThreads} from '../../utils/storage';
import {MessageThread} from '../../types';
import {useTheme} from '../../contexts/ThemeContext';

const MessagesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {mode} = useTheme();
  const colors = getColors(mode);
  const [threads, setThreads] = useState<MessageThread[]>([]);

  const loadThreads = async () => {
    const data = await getMessageThreads();
    setThreads(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadThreads();
    }, []),
  );

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={[styles.container, {paddingTop: insets.top}]}>
      <Text style={styles.title}>Messages</Text>

      {threads.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyText}>
            Start a conversation with a vendor from a listing.
          </Text>
        </View>
      ) : (
        threads.map(thread => (
          <TouchableOpacity
            key={thread.id}
            style={styles.thread}
            onPress={() =>
              navigation.navigate('HomeTab', {
                screen: 'Chat',
                params: {threadId: thread.id},
              })
            }>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{thread.title.charAt(0)}</Text>
            </View>
            <View style={styles.threadContent}>
              <View style={styles.threadHeader}>
                <Text style={styles.threadName}>{thread.title}</Text>
                <Text style={styles.threadTime}>
                  {new Date(thread.updatedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
              </View>
              <Text style={styles.threadMessage} numberOfLines={1}>
                {thread.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  thread: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 18,
  },
  threadContent: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  threadName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  threadTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  threadMessage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default MessagesScreen;

