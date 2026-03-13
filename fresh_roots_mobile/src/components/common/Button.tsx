import React, {useMemo} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {getColors, borderRadius, typography} from '../../theme';
import {useTheme} from '../../contexts/ThemeContext';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Theme-aware Button component
 */
const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const {mode} = useTheme();
  const colors = getColors(mode);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const buttonStyles = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    variant === 'outline' && styles.outlineButton,
    fullWidth && styles.fullWidth,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'outline' && styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyles}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textInverse : colors.primary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    button: {
      height: 50,
      borderRadius: borderRadius.large,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      elevation: 4,
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    disabledButton: {
      backgroundColor: colors.surface,
      opacity: 0.6,
    },
    fullWidth: {
      width: '100%',
    },
    text: {
      ...typography.button,
      fontSize: 16,
      fontWeight: '600',
    },
    primaryText: {
      color: colors.textInverse,
    },
    secondaryText: {
      color: colors.primary,
    },
    outlineText: {
      color: colors.primary,
    },
    disabledText: {
      color: colors.textSecondary,
    },
  });

export default Button;
