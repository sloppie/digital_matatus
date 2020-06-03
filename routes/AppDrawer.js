import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStack from './HomeStack';
import ReportStack from './ReportStack';

// ICONS

// home icon
function HomeIcon({ focused, color, size}) {

  return (
    <Icon 
      name={focused?"home": "home-outline"}
      color={color}
      size={size}
    />
  );
}

// Report ICON
function ReportIcon({ focused, color, size}) {

  return (
    <Icon 
      name="file-send"
      color={color}
      size={size}
    />
  );
}

function Home(props) {
  HOME_NAVIGATION_REF = props.navigation;

  return <HomeStack />
}

function Report(props) {
  REPORT_NAVIGATION_REF = props.navigation;

  return <ReportStack />
}

// REFS
let HOME_NAVIGATION_REF;
let REPORT_NAVIGATION_REF;

const AppDrawer = createDrawerNavigator();

export default () => (
  <AppDrawer.Navigator
    initialRouteName="Report"
    minSwipeDistance={30}
    edgeWidth={100}
  >
    <AppDrawer.Screen 
      name="Report"
      component={Report}
      options={{
        unmountOnBlur: true,
        drawerIcon: (props) => <ReportIcon {...props} />
      }}
    />
    <AppDrawer.Screen
      name="Home"
      component={Home}
      options={{
        drawerIcon: (props) => <HomeIcon {...props} />
      }}
    />
  </AppDrawer.Navigator>
);

export {
  HOME_NAVIGATION_REF,
  REPORT_NAVIGATION_REF,
};
