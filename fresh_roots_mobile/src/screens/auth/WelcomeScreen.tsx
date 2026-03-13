import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WelcomeScreenNavigationProp} from '../../navigation/types';
import {getColors, spacing, typography} from '../../theme';
import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({navigation}) => {
  const {continueAsGuest} = useAuth();
  const insets = useSafeAreaInsets();
  const {mode} = useTheme();
  const colors = getColors(mode);
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, {paddingTop: insets.top + spacing.md}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.logo}>🌱 Fresh Roots</Text>
          <Text style={styles.subtitle}>Frais ek Kalite</Text>
          
          <View style={styles.heroContainer}>
            <Text style={styles.heroPlaceholder}>🥬🥕🍅</Text>
          </View>

          <Text style={styles.title}>Explore the World of{'\n'}Fresh Vegetables</Text>
          <Text style={styles.description}>
            Enjoy the diversity and benefits of fresh vegetables every day
          </Text>
        </View>

        <View style={[styles.footer, {paddingBottom: insets.bottom + spacing.lg}]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={continueAsGuest}>
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
    },
    logo: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: spacing.xl,
    },
    heroContainer: {
      width: 200,
      height: 200,
      backgroundColor: colors.surface,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    heroPlaceholder: {
      fontSize: 64,
    },
    title: {
      ...typography.h2,
      textAlign: 'center',
      color: colors.text,
      marginBottom: spacing.md,
    },
    description: {
      ...typography.body1,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    footer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    primaryButtonText: {
      ...typography.button,
      color: colors.textInverse,
    },
    guestButton: {
      backgroundColor: colors.surface,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    guestButtonText: {
      ...typography.button,
      color: colors.primary,
    },
    linkText: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    linkTextBold: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

export default WelcomeScreen;
