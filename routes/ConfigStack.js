import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import { LoginScreen, InitialSetup } from '../screens';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={InitialSetup} />
  </Stack.Navigator>
);
