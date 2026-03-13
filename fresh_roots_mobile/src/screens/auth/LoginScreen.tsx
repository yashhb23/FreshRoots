import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {LoginScreenNavigationProp} from '../../navigation/types';
import {getColors, spacing, typography, borderRadius} from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';

interface Props {
  navigation: LoginScreenNavigationProp;
}

/**
 * Helper to extract a readable error message from any error type.
 */
const getErrorMessage = (error: unknown): string => {
  const raw =
    error instanceof Error
      ? error.message
      : error && typeof error === 'object' && 'message' in error
        ? String((error as {message: unknown}).message)
        : typeof error === 'string'
          ? error
          : '';

  if (raw.includes('DEVELOPER_ERROR')) {
    return 'Google Sign-In is not available right now. Please try email login.';
  }
  if (raw.includes('NETWORK_ERROR') || raw.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  return raw || 'An unexpected error occurred. Please try again.';
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {login, googleSignIn, continueAsGuest} = useAuth();
  const {mode} = useTheme();
  const colors = getColors(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const errorDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss inline error after 5 seconds
  useEffect(() => {
    if (!loginError) return;
    errorDismissRef.current = setTimeout(() => setLoginError(''), 5000);
    return () => {
      if (errorDismissRef.current) clearTimeout(errorDismissRef.current);
    };
  }, [loginError]);

  const validateEmail = (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (text: string): boolean => {
    if (!text) {
      setPasswordError('Password is required');
      return false;
    }
    if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoginError('');
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      // Navigation will happen automatically via RootNavigator auth state
    } catch (error: unknown) {
      setLoginError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginError('');
    setIsGoogleLoading(true);
    try {
      await googleSignIn();
      // Navigation will happen automatically via RootNavigator auth state
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (!message.toLowerCase().includes('cancel')) {
        setLoginError(message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.logo}>🌱 Fresh Roots</Text>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {loginError ? (
            <TouchableOpacity
              style={styles.errorBanner}
              onPress={() => setLoginError('')}
              activeOpacity={0.9}>
              <Text style={styles.errorBannerText}>{loginError}</Text>
              <Text style={styles.errorBannerDismiss}>✕</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (loginError) setLoginError('');
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (loginError) setLoginError('');
                if (passwordError) validatePassword(text);
              }}
              onBlur={() => validatePassword(password)}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading || isGoogleLoading}
              fullWidth
              style={styles.signInButton}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign-In Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}>
              {isGoogleLoading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={continueAsGuest}
              disabled={isLoading || isGoogleLoading}>
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>

            <View style={styles.registerSection}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
    },
    backButton: {
      paddingVertical: spacing.sm,
    },
    backText: {
      ...typography.body1,
      color: colors.primary,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
    },
    logo: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    title: {
      ...typography.h2,
      textAlign: 'center',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body1,
      textAlign: 'center',
      color: colors.textSecondary,
      marginBottom: spacing.xl,
    },
    errorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.error,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.medium,
      marginBottom: spacing.md,
    },
    errorBannerText: {
      ...typography.body2,
      flex: 1,
      color: colors.textInverse,
      marginRight: spacing.sm,
    },
    errorBannerDismiss: {
      fontSize: 16,
      color: colors.textInverse,
      fontWeight: '700',
      padding: spacing.xs,
    },
    form: {
      marginTop: spacing.lg,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: spacing.lg,
    },
    forgotPasswordText: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '600',
    },
    signInButton: {
      marginTop: spacing.md,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      ...typography.body2,
      color: colors.textSecondary,
      marginHorizontal: spacing.md,
    },
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderRadius: borderRadius.large,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      marginBottom: spacing.md,
    },
    googleIcon: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4285F4',
      marginRight: spacing.sm,
    },
    googleButtonText: {
      ...typography.button,
      color: colors.text,
    },
    guestButton: {
      backgroundColor: colors.surface,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    guestButtonText: {
      ...typography.button,
      color: colors.primary,
    },
    registerSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.lg,
    },
    registerText: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    registerLink: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '600',
    },
  });

export default LoginScreen;
