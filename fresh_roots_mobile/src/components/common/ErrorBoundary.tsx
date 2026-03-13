import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {spacing, borderRadius} from '../../theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the app
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Here you could log to an error reporting service like Sentry
  }

  handleRetry = (): void => {
    this.setState({hasError: false, error: null});
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.icon}>😵</Text>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.description}>
              The app encountered an unexpected error. Please try again.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              activeOpacity={0.8}>
              <Text style={styles.retryButtonText}>Reload</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: '#0D0E0F',
  },
  card: {
    width: '100%',
    maxWidth: 320,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    backgroundColor: '#181A1C',
    borderWidth: 1,
    borderColor: '#2E3136',
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
    color: '#F0F2F5',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    color: '#A8ACB1',
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.large,
    minWidth: 140,
    alignItems: 'center',
    backgroundColor: '#5ED565',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D0E0F',
  },
});

export default ErrorBoundary;
