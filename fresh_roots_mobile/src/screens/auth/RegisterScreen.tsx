import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {RegisterScreenNavigationProp} from '../../navigation/types';
import {getColors, spacing, typography, borderRadius} from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';

interface Props {
  navigation: RegisterScreenNavigationProp;
}

/**
 * Helper to extract a readable error message from any error type.
 * Prevents showing "[object Object]" in alerts.
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
    return 'Google Sign-In is not available right now. Please try email registration.';
  }
  if (raw.includes('NETWORK_ERROR') || raw.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }

  return raw || 'An unexpected error occurred. Please try again.';
};

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const {register, googleSignIn} = useAuth();
  const {mode} = useTheme();
  const colors = getColors(mode);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateName = (text: string): boolean => {
    if (!text.trim()) {
      setNameError('Name is required');
      return false;
    }
    if (text.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const validateConfirmPassword = (text: string): boolean => {
    if (!text) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      return;
    }

    setIsLoading(true);
    try {
      await register(
        name.trim(),
        email.trim(),
        password,
        phone.trim() || undefined,
        selectedRole,
      );
      // Navigation will happen automatically via RootNavigator auth state
    } catch (error: unknown) {
      Alert.alert('Registration Failed', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await googleSignIn();
      // Navigation will happen automatically via RootNavigator auth state
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      // Don't show alert if user just cancelled
      if (!message.toLowerCase().includes('cancel')) {
        Alert.alert('Google Sign-In Failed', message);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join our fresh vegetable marketplace
          </Text>

          {/* Role Selector */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'buyer' && styles.roleOptionActive,
              ]}
              onPress={() => setSelectedRole('buyer')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.roleOptionText,
                  selectedRole === 'buyer' && styles.roleOptionTextActive,
                ]}>
                Buyer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'seller' && styles.roleOptionActive,
              ]}
              onPress={() => setSelectedRole('seller')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.roleOptionText,
                  selectedRole === 'seller' && styles.roleOptionTextActive,
                ]}>
                Seller
              </Text>
            </TouchableOpacity>
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

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={text => {
                setName(text);
                if (nameError) validateName(text);
              }}
              onBlur={() => validateName(name)}
              error={nameError}
              autoCapitalize="words"
            />

            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={text => {
                setEmail(text);
                if (emailError) validateEmail(text);
              }}
              onBlur={() => validateEmail(email)}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Phone (Optional)"
              placeholder="+230 5XXX XXXX"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Input
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (passwordError) validatePassword(text);
              }}
              onBlur={() => validatePassword(password)}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (confirmPasswordError) validateConfirmPassword(text);
              }}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              error={confirmPasswordError}
              secureTextEntry
              autoCapitalize="none"
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading || isGoogleLoading}
              fullWidth
              style={styles.registerButton}
            />

            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
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
      paddingTop: spacing.md,
    },
    logo: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
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
      marginBottom: spacing.lg,
    },
    roleContainer: {
      flexDirection: 'row',
      borderRadius: borderRadius.large,
      borderWidth: 1.5,
      borderColor: colors.primary,
      overflow: 'hidden',
      marginBottom: spacing.lg,
    },
    roleOption: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    roleOptionActive: {
      backgroundColor: colors.primary,
    },
    roleOptionText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
    },
    roleOptionTextActive: {
      color: colors.textInverse,
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
    form: {
      marginTop: spacing.sm,
    },
    registerButton: {
      marginTop: spacing.md,
    },
    loginSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
    loginText: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    loginLink: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '600',
    },
  });

export default RegisterScreen;
