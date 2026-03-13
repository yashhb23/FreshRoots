import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MainTabParamList} from './types';
import HomeNavigator from './HomeNavigator';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import {getColors} from '../theme';
import {useTheme} from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const {mode} = useTheme();
  const insets = useSafeAreaInsets();
  const themeColors = getColors(mode);

  const TAB_BAR_HEIGHT = 56;
  const tabBarHeight = TAB_BAR_HEIGHT + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          backgroundColor: themeColors.cardBg,
          borderTopWidth: 1,
          borderTopColor: themeColors.border,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: mode === 'dark' ? 0.4 : 0.1,
          shadowOffset: {width: 0, height: -2},
          shadowRadius: 8,
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'view-grid' : 'view-grid-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'heart' : 'heart-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
