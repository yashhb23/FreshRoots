import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import {colors} from '../theme';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {isLoading, isAuthenticated, isGuest} = useAuth();
  const {mode} = useTheme();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    // Key by theme mode so the whole tree re-renders when toggling DarkModeTab
    <NavigationContainer key={mode}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated && !isGuest ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;
