import React, {useMemo} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import {getColors, borderRadius, spacing, typography} from '../../theme';
import {useTheme} from '../../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/**
 * Theme-aware Input component
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const {mode} = useTheme();
  const colors = getColors(mode);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.textLight}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.body2,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.medium,
      paddingHorizontal: spacing.md,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.surface,
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      ...typography.caption,
      color: colors.error,
      marginTop: spacing.xs,
    },
  });

export default Input;
