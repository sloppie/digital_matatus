import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AllReports, ReportDetails, ReportCulprit } from '../screens';

import { VIEW_REPORT_NAVIGATION_REF } from './AppDrawer';
import { View } from 'react-native';

const Stack = createStackNavigator();

/**
 * @todo add a ConfirmCulprit screen
 */
export default () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#444"
      },
    }}
  >
    <Stack.Screen 
      name="AllReports" 
      component={AllReports} 
      options={{
        headerLeft: (props) => (
          <Icon 
            {...props} 
            onPress={VIEW_REPORT_NAVIGATION_REF.openDrawer}
            name="menu"
            color="white"
            size={30}
          />
        ),
        headerLeftContainerStyle: {
          padding: 16
        },
      }}
    />
    <Stack.Screen 
      name="ReportDetails" 
      component={ReportDetails} 
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen name="ReportCulprit" component={ReportCulprit} />
  </Stack.Navigator>
);
