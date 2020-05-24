import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  Home,
  RouteDetails,
  Report,
} from '../screens';

const Stack = createStackNavigator();

export default () => <Stack.Navigator>
  {/* <Stack.Screen 
    name="Home" 
    component={Home} 
    options={{
      headerShown: false
    }}
  />
  <Stack.Screen 
    name="RouteDetails" 
    component={RouteDetails} 
    options={{
      headerTransparent: true,
      title: ""
    }} 
  /> */}
  <Stack.Screen 
    name="Report Case"
    component={Report}
  />
</Stack.Navigator>