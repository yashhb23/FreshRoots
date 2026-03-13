// Fresh Roots Color Palette - matching the UI design
export const lightColors = {
  // Primary Colors (Fresh Green Theme)
  primary: '#4CAF50', // Bright green for main actions
  primaryDark: '#2D8659', // Deeper green for headers
  primaryLight: '#81C784', // Light green for accents

  // Secondary Colors
  secondary: '#FFA726', // Orange for badges/accents
  secondaryLight: '#FFB74D',

  // Neutral Colors
  background: '#FFFFFF', // White background
  surface: '#F5F5F5', // Light gray for cards
  surfaceAlt: '#FAFAFA', // Subtle gray

  // Text Colors
  text: '#212121', // Dark gray for primary text
  textSecondary: '#757575', // Medium gray for secondary text
  textLight: '#BDBDBD', // Light gray for placeholders
  textInverse: '#FFFFFF', // White text for dark backgrounds

  // Status Colors
  success: '#4CAF50', // Green for success messages
  error: '#F44336', // Red for errors
  warning: '#FF9800', // Orange for warnings
  info: '#2196F3', // Blue for info

  // Border & Divider
  border: '#E0E0E0',
  divider: '#EEEEEE',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Badges & Tags
  badge: '#FF5252',
  badgeText: '#FFFFFF',

  // Rating
  ratingActive: '#FFC107',
  ratingInactive: '#E0E0E0',

  // Layout-specific
  headerBg: '#2D6A4F',
  promoBg: '#FFF8E1',
  promoAccent: '#E8F5E9',
  cardBg: '#FFFFFF',
};

export const darkColors: typeof lightColors = {
  // Primary Colors - keep the fresh green accents
  primary: '#5ED565', // Brighter green for dark mode visibility
  primaryDark: '#4CAF50',
  primaryLight: '#2D5A30', // Muted green for subtle accents

  // Secondary Colors
  secondary: '#FFB347', // Warmer orange
  secondaryLight: '#FFC87C',

  // Neutral Colors - deep charcoal tones
  background: '#0D0E0F', // True dark background
  surface: '#181A1C', // Elevated surfaces
  surfaceAlt: '#222527', // Cards/modals

  // Text Colors - high contrast on dark
  text: '#F0F2F5', // Primary text
  textSecondary: '#A8ACB1', // Secondary text
  textLight: '#6C7177', // Muted text
  textInverse: '#0D0E0F', // On primary buttons

  // Status Colors - slightly brighter for dark mode
  success: '#5ED565',
  error: '#FF6B6B',
  warning: '#FFB347',
  info: '#4DA6FF',

  // Border & Divider
  border: '#2E3136',
  divider: '#262A2D',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.75)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Badges & Tags
  badge: '#FF6B6B',
  badgeText: '#FFFFFF',

  // Rating
  ratingActive: '#FFD93D',
  ratingInactive: '#3D4147',

  // Layout-specific
  headerBg: '#1B4332',
  promoBg: '#2A3A30',
  promoAccent: '#1E3A2B',
  cardBg: '#181A1C',
};

export type ThemeMode = 'light' | 'dark';
export type ColorKey = keyof typeof lightColors;

let currentTheme: ThemeMode = 'light';

export const setThemeMode = (mode: ThemeMode) => {
  currentTheme = mode;
};

export const getThemeMode = () => currentTheme;

export const getColors = (mode: ThemeMode) =>
  mode === 'dark' ? darkColors : lightColors;

export const colors = new Proxy(lightColors, {
  get(_, prop: string) {
    const palette = getColors(currentTheme);
    return palette[prop as ColorKey];
  },
}) as typeof lightColors;
