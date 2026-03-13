import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {HomeStackParamList} from '../../navigation/types';
import {getColors, spacing, borderRadius} from '../../theme';
import {useTheme} from '../../contexts/ThemeContext';
import {
  appendThreadMessage,
  ensureSeedThreadMessages,
  getMessageThreads,
  getThreadMessages,
  type LocalMessage,
} from '../../utils/storage';

type ChatRouteProp = RouteProp<HomeStackParamList, 'Chat'>;

/**
 * ChatScreen
 * Demo-only chat experience backed by AsyncStorage.
 * - Vendor identity is not verified yet (per requirement).
 * - Messages are stored per-thread locally on device.
 */
const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<ChatRouteProp>();
  const {mode} = useTheme();
  const colors = getColors(mode);

  const {threadId} = route.params;
  const [title, setTitle] = useState('Chat');
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [draft, setDraft] = useState('');

  const listRef = useRef<FlatList<LocalMessage>>(null);

  useEffect(() => {
    const load = async () => {
      const threads = await getMessageThreads();
      const thread = threads.find(t => t.id === threadId);
      setTitle(thread?.title || 'Chat');

      // Seed a simple conversation if none exists yet.
      await ensureSeedThreadMessages(threadId, thread?.lastMessage);
      const data = await getThreadMessages(threadId);
      setMessages(data);
    };
    load();
  }, [threadId]);

  useEffect(() => {
    // Keep the newest message visible.
    if (messages.length > 0) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({animated: true}));
    }
  }, [messages.length]);

  const onSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');

    await appendThreadMessage(threadId, {
      sender: 'user',
      text,
    });

    // Demo auto-reply from vendor.
    setTimeout(async () => {
      await appendThreadMessage(threadId, {
        sender: 'vendor',
        text: "Thanks! I'll reply shortly. What quantity do you need?",
      });
      const updated = await getThreadMessages(threadId);
      setMessages(updated);
    }, 600);

    const updated = await getThreadMessages(threadId);
    setMessages(updated);
  };

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, {paddingTop: insets.top}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>
            {title.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        renderItem={({item}) => {
          const isUser = item.sender === 'user';
          return (
            <View
              style={[
                styles.bubbleRow,
                isUser ? styles.bubbleRowRight : styles.bubbleRowLeft,
              ]}>
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleVendor,
                ]}>
                <Text
                  style={[
                    styles.bubbleText,
                    isUser ? styles.bubbleTextUser : styles.bubbleTextVendor,
                  ]}>
                  {item.text}
                </Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.composer, {paddingBottom: insets.bottom + spacing.sm}]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message..."
          placeholderTextColor={colors.textLight}
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={onSend} style={styles.send}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    back: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backText: {
      fontSize: 20,
      color: colors.text,
      fontWeight: '700',
    },
    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm,
    },
    headerAvatarText: {
      color: colors.textInverse,
      fontWeight: '700',
      fontSize: 16,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      paddingHorizontal: spacing.sm,
    },
    headerRight: {
      width: 40,
      height: 40,
    },
    messageList: {
      flex: 1,
    },
    listContent: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
      flexGrow: 1,
    },
    bubbleRow: {
      marginBottom: spacing.sm,
      flexDirection: 'row',
    },
    bubbleRowLeft: {
      justifyContent: 'flex-start',
    },
    bubbleRowRight: {
      justifyContent: 'flex-end',
    },
    bubble: {
      maxWidth: '82%',
      borderRadius: borderRadius.large,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    bubbleVendor: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopLeftRadius: 6,
    },
    bubbleUser: {
      backgroundColor: colors.primary,
      borderTopRightRadius: 6,
    },
    bubbleText: {
      fontSize: 14,
      lineHeight: 20,
    },
    bubbleTextVendor: {
      color: colors.text,
    },
    bubbleTextUser: {
      color: colors.textInverse,
    },
    time: {
      marginTop: 6,
      fontSize: 11,
      color: colors.textSecondary,
      opacity: 0.8,
    },
    composer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.large,
      paddingHorizontal: spacing.md,
      paddingVertical: Platform.OS === 'ios' ? 12 : 10,
      color: colors.text,
      backgroundColor: colors.background,
    },
    send: {
      height: 44,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.large,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    sendText: {
      color: colors.textInverse,
      fontWeight: '700',
    },
  });

export default ChatScreen;

