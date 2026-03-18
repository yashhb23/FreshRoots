import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeStackParamList} from './types';
import HomeScreen from '../screens/main/HomeScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import CartScreen from '../screens/main/CartScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import OrderSuccessScreen from '../screens/main/OrderSuccessScreen';
import ChatScreen from '../screens/main/ChatScreen';
import MessagesScreen from '../screens/main/MessagesScreen';
import EditAddressScreen from '../screens/main/EditAddressScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#fff'},
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="EditAddress" component={EditAddressScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
