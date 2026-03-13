// Theme barrel export
export * from './colors';
export * from './spacing';
export * from './typography';

// Border radius
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xl: 16,
  round: 999, // Fully rounded (pills, badges)
};

// Shadows
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Common dimensions
export const dimensions = {
  screenPadding: 16,
  headerHeight: 56,
  tabBarHeight: 60,
  buttonHeight: 48,
  buttonHeightSmall: 36,
  inputHeight: 48,
  cardImageAspectRatio: 1, // 1:1 for product cards
  productDetailImageHeight: 300,
};
