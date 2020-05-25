import React from 'react'; 
import { createStackNavigator } from '@react-navigation/stack';
import { Report, CategoryDefinition } from './../screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { REPORT_NAVIGATION_REF } from './AppDrawer';

const Stack = createStackNavigator();


export default () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ReportIncident"
      component={Report}
      options={{
        title: "Report Incident",
      headerLeft: (props) => (
        <Icon 
          {...props} 
          onPress={REPORT_NAVIGATION_REF.openDrawer}
          name="menu"
          size={30}
        />
      ),
        headerLeftContainerStyle: {
          padding: 16
        },
      }}
    />
    <Stack.Screen 
      name="CategoryDefinition"
      component={CategoryDefinition}
      options={{title: "Category Definition"}}
    />
  </Stack.Navigator>
);