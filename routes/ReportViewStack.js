import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AllReports, ReportDetails, ReportCulprit } from '../screens';

const Stack = createStackNavigator();

/**
 * @todo add a ConfirmCulprit screen
 */
export default () => (
  <Stack.Navigator>
    <Stack.Screen name="AllReports" component={AllReports} />
    <Stack.Screen name="ReportDetails" component={ReportDetails} />
    <Stack.Screen name="ReportCulprit" component={ReportCulprit} />
  </Stack.Navigator>
);
