import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { AllReports, ReportDetails, ReportCulprit, MediaView } from '../screens';

import AllReports from '../screens/all_reports';
import ReportDetails from '../screens/report_details';
import ReportCulprit from '../screens/report_culprit';
import MediaView from '../screens/media_view';

import { VIEW_REPORT_NAVIGATION_REF } from './AppDrawer';


const Stack = createStackNavigator();

/**
 * @todo add a ConfirmCulprit screen
 */
export default () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "purple",
        elevation: 1,
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
        // headerShown: false,
      }}
    />
    <Stack.Screen 
      name="MediaView"
      component={MediaView}
      options={{
        headerTransparent: true,
        title: "Preview",
      }}
    />
    <Stack.Screen name="ReportCulprit" component={ReportCulprit} />
  </Stack.Navigator>
);
