/**
 * Fresh Roots Mobile App
 * Fresh vegetable marketplace for Mauritius
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/contexts/AuthContext';
import {CartProvider} from './src/contexts/CartContext';
import {FavoritesProvider} from './src/contexts/FavoritesContext';
import {ThemeProvider} from './src/contexts/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import {getColors} from './src/theme';
import {useTheme} from './src/contexts/ThemeContext';
import {configureFirebase} from './src/services/firebase';
import ErrorBoundary from './src/components/common/ErrorBoundary';

const AppInner = () => {
  const {mode} = useTheme();
  const colors = getColors(mode);
  return (
    <>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <RootNavigator />
    </>
  );
};

function App(): React.JSX.Element {
  useEffect(() => {
    // Configure Firebase on app start
    configureFirebase();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <AppInner />
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
