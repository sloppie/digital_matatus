import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  Home,
  RouteDetails,
  NumberPlate,
  ReportDetails,
  ReportCulprit,
  Camera,
} from '../screens';
import Theme from '../theme';

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={Home} 
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen 
      name="Camera" 
      component={Camera} 
      options={{
        // unmountOnBlur: true,
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="RouteDetails" 
      component={RouteDetails} 
      options={{
        headerTransparent: true,
        title: ""
      }} 
    />
    <Stack.Screen 
      name="NumberPlate" 
      component={NumberPlate} 
      options={{
        title: "Fill in car details"
      }} 
    />
    <Stack.Screen 
      name="ReportDetails" 
      component={ReportDetails} 
      options={{
        // headerShown: false,
        headerStyle: {
          backgroundColor: Theme.PrimaryColor,
        },
        headerTintColor: "white",
      }} 
    />
    <Stack.Screen 
      name="ReportCulprit" 
      component={ReportCulprit} 
      options={{
      }} 
    />
  </Stack.Navigator>
);
