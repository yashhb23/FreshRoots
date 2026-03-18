import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {useTheme} from '../../contexts/ThemeContext';

export type SortOption = 'price_asc' | 'price_desc' | 'created_desc' | 'popular';

export interface FilterValues {
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  sortBy?: SortOption;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialValues: FilterValues;
}

const SORT_OPTIONS: {value: SortOption; label: string; icon: string}[] = [
  {value: 'popular', label: 'Most Popular', icon: 'fire'},
  {value: 'price_asc', label: 'Price: Low to High', icon: 'arrow-up'},
  {value: 'price_desc', label: 'Price: High to Low', icon: 'arrow-down'},
  {value: 'created_desc', label: 'Newest First', icon: 'clock-outline'},
];

const FiltersModal: React.FC<Props> = ({visible, onClose, onApply, initialValues}) => {
  const {mode} = useTheme();
  const colors = getColors(mode);

  const [minPrice, setMinPrice] = useState(initialValues.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice?.toString() || '');
  const [inStockOnly, setInStockOnly] = useState(initialValues.inStockOnly);
  const [sortBy, setSortBy] = useState<SortOption | undefined>(initialValues.sortBy);

  const handleApply = () => {
    onApply({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStockOnly,
      sortBy,
    });
    onClose();
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy(undefined);
  };

  const activeFilterCount = [
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  ].filter(Boolean).length;

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetText}>Reset All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Sort By */}
          <Text style={styles.sectionLabel}>Sort By</Text>
          <View style={styles.sortGrid}>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.sortChip,
                  sortBy === opt.value && styles.sortChipActive,
                ]}
                onPress={() => setSortBy(sortBy === opt.value ? undefined : opt.value)}>
                <Icon
                  name={opt.icon}
                  size={16}
                  color={sortBy === opt.value ? colors.textInverse : colors.text}
                />
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === opt.value && styles.sortChipTextActive,
                  ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text style={styles.sectionLabel}>Price Range (Rs)</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <Text style={styles.priceSeparator}>—</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Max"
              placeholderTextColor={colors.textLight}
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>

          {/* In Stock Only */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>In Stock Only</Text>
              <Text style={styles.switchDesc}>Hide out-of-stock items</Text>
            </View>
            <Switch
              value={inStockOnly}
              onValueChange={setInStockOnly}
              trackColor={{false: colors.border, true: colors.primaryLight}}
              thumbColor={inStockOnly ? colors.primary : colors.textLight}
            />
          </View>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
    },
    resetText: {
      fontSize: 14,
      color: colors.error,
      fontWeight: '600',
      marginRight: spacing.md,
    },
    closeBtn: {
      padding: spacing.xs,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      marginTop: spacing.sm,
    },
    sortGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    sortChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    sortChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    sortChipText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    sortChipTextActive: {
      color: colors.textInverse,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    priceInput: {
      flex: 1,
      height: 46,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.large,
      paddingHorizontal: spacing.md,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    priceSeparator: {
      marginHorizontal: spacing.sm,
      fontSize: 18,
      color: colors.textLight,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      marginBottom: spacing.lg,
    },
    switchLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    switchDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    applyBtn: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.large,
      paddingVertical: 14,
      alignItems: 'center',
      ...shadows.medium,
    },
    applyText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textInverse,
    },
  });

export default FiltersModal;
