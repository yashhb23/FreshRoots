import React, {useMemo} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Category} from '../../types';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {useTheme} from '../../contexts/ThemeContext';

interface CategoryChipProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  vegetables: '🥦',
  fruits: '🍎',
  herbs: '🌿',
  'root-vegetables': '🥕',
  'leafy-greens': '🥬',
};

const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  selected,
  onPress,
}) => {
  const {mode} = useTheme();
  const colors = getColors(mode);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const emoji = CATEGORY_ICONS[category.slug] || '🌱';

  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{emoji}</Text>
      </View>
      <Text style={[styles.text, selected && styles.textSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      backgroundColor: colors.surface,
      marginRight: spacing.sm,
      ...shadows.small,
    },
    chipSelected: {
      backgroundColor: colors.primary,
    },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.85)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.xs,
    },
    icon: {
      fontSize: 16,
    },
    text: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    textSelected: {
      color: colors.textInverse,
    },
  });

export default CategoryChip;
