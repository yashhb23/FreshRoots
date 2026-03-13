// Navigation types for type-safe navigation
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

// Main Tabs
export type MainTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  FavoritesTab: undefined;
  ProfileTab: undefined;
};

// Home Stack (nested in HomeTab)
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: {id: string};
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: {orderId: string};
  Chat: {threadId: string};
  Messages: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Navigation props for screens
export type WelcomeScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Welcome'
>;

export type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

export type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, 'Home'>,
  BottomTabNavigationProp<MainTabParamList>
>;

export type ProductDetailScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ProductDetail'
>;

export type CartScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Cart'
>;
