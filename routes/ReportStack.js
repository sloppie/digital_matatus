import React from 'react'; 
import { createStackNavigator } from '@react-navigation/stack';
import { Report, CategoryDefinition, SetReminder, NumberPlate } from './../screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { REPORT_NAVIGATION_REF } from './AppDrawer';
import Theme from '../theme';

function LeftIcon(props) {
  return (
    <Icon 
      {...props}
      onPress={REPORT_NAVIGATION_REF.openDrawer}
      name="menu"
      color="white"
      size={30}
    />
  );
}


const Stack = createStackNavigator();


export default () => (
  <Stack.Navigator
    screenOptions={{
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#444",
      },
    }}
  >
    <Stack.Screen 
      name="ReportIncident"
      component={Report}
      options={{
        title: "Report Incident",
        headerLeft: LeftIcon,
        headerLeftContainerStyle: {
          padding: 16,
        },
      }}
    />
    <Stack.Screen 
      name="CategoryDefinition"
      component={CategoryDefinition}
      options={{title: "Category Definition"}}
    />
    <Stack.Screen 
      name="NumberPlate"
      component={NumberPlate}
      options={{title: "Fill Car Details"}}
    />
    <Stack.Screen 
      name="SetReminder"
      component={SetReminder}
      options={{title: "Set Reminder"}}
    />
  </Stack.Navigator>
);