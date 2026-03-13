import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors, spacing, borderRadius, shadows} from '../../theme';
import {Category} from '../../types';
import {listingsService} from '../../services/api';
import {useTheme} from '../../contexts/ThemeContext';

const CATEGORY_ICONS: Record<string, string> = {
  vegetables: '🥦',
  fruits: '🍎',
  herbs: '🌿',
  'root-vegetables': '🥕',
  'leafy-greens': '🥬',
};

/**
 * Full-page categories browser. Tapping a category navigates
 * to the HomeTab where the listings can be filtered.
 */
const CategoriesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {mode} = useTheme();
  const colors = getColors(mode);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await listingsService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('HomeTab', {screen: 'Home', params: {categoryId: category.id}});
  };

  const styles = useMemo(() => createStyles(colors), [colors]);

  const renderCategory = ({item}: {item: Category}) => {
    const emoji = CATEGORY_ICONS[item.slug] || '🌱';
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.85}>
        <View style={styles.emojiCircle}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDesc} numberOfLines={2}>
          {item.description || 'Explore fresh picks'}
        </Text>
        <Icon
          name="arrow-right"
          size={18}
          color={colors.primary}
          style={styles.arrow}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={renderCategory}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    grid: {
      paddingHorizontal: spacing.md,
      paddingBottom: 100,
    },
    row: {
      justifyContent: 'space-between',
    },
    card: {
      width: '48%',
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.xl,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows.small,
    },
    emojiCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.promoAccent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    emoji: {
      fontSize: 24,
    },
    categoryName: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    categoryDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 16,
      marginBottom: spacing.sm,
    },
    arrow: {
      alignSelf: 'flex-end',
    },
  });

export default CategoriesScreen;
