import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {getColors, spacing, borderRadius} from '../../theme';
import {useTheme} from '../../contexts/ThemeContext';

interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
  type?: 'network' | 'server' | 'timeout' | 'offline';
}

/**
 * NetworkError component - displays user-friendly error messages
 * for network failures, server errors, timeouts, and offline states
 */
const NetworkError: React.FC<NetworkErrorProps> = ({
  message,
  onRetry,
  type = 'network',
}) => {
  const {mode} = useTheme();
  const colors = getColors(mode);

  const getErrorContent = () => {
    switch (type) {
      case 'offline':
        return {
          icon: '📡',
          title: 'You are offline',
          description: 'Please check your internet connection and try again.',
        };
      case 'server':
        return {
          icon: '🔧',
          title: 'Server Error',
          description: 'Something went wrong on our end. Please try again later.',
        };
      case 'timeout':
        return {
          icon: '⏱️',
          title: 'Request Timed Out',
          description: 'The server took too long to respond. Please try again.',
        };
      default:
        return {
          icon: '🌐',
          title: 'Connection Error',
          description: message || 'Unable to connect. Please check your connection.',
        };
    }
  };

  const content = getErrorContent();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
        <Text style={styles.icon}>{content.icon}</Text>
        <Text style={[styles.title, {color: colors.text}]}>{content.title}</Text>
        <Text style={[styles.description, {color: colors.textSecondary}]}>
          {content.description}
        </Text>
        {onRetry && (
          <TouchableOpacity
            style={[styles.retryButton, {backgroundColor: colors.primary}]}
            onPress={onRetry}
            activeOpacity={0.8}>
            <Text style={[styles.retryButtonText, {color: colors.textInverse}]}>
              Try Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
  },
  icon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.large,
    minWidth: 140,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NetworkError;
