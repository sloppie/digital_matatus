import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStack from './HomeStack';
import ReportStack from './ReportStack';
import ReportViewStack from './ReportViewStack';


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

function ViewReportsIcon({ focused, color, size}) {

  return (
    <Icon 
      name="information"
      color={color}
      size={size}
    />
  );
}

// SCREENS START HERE
function Home(props) {
  HOME_NAVIGATION_REF = props.navigation;

  return <HomeStack />
}

function Report(props) {
  REPORT_NAVIGATION_REF = props.navigation;

  return <ReportStack />
}

function ReportV2(props) {
  REPORT_NAVIGATION_REF = props.navigation;

  return <ReportStackV2 />
}

function ViewReports(props) {
  VIEW_REPORT_NAVIGATION_REF = props.navigation;

  return <ReportViewStack />
}

// REFS
let HOME_NAVIGATION_REF;
let REPORT_NAVIGATION_REF;
let VIEW_REPORT_NAVIGATION_REF;

const AppDrawer = createDrawerNavigator();

export default () => (
  <AppDrawer.Navigator
    initialRouteName="Home"
    minSwipeDistance={30}
    edgeWidth={100}
  >
    <AppDrawer.Screen
      name="Home"
      component={Home}
      options={{
        drawerIcon: (props) => <HomeIcon {...props} />
      }}
    />
    <AppDrawer.Screen 
      name="Report"
      component={Report}
      options={{
        // unmountOnBlur: true,
        drawerIcon: (props) => <ReportIcon {...props} />
      }}
    />
    {/* <AppDrawer.Screen 
      name="Report"
      component={ReportV2}
      options={{
        unmountOnBlur: true,
        drawerIcon: (props) => <ReportIcon {...props} />
      }}
    /> */}
    <AppDrawer.Screen 
      name="ViewReports"
      component={ViewReports}
      options={{
        drawerIcon: (props) => <ViewReportsIcon {...props} />
      }}
    />
  </AppDrawer.Navigator>
);

export {
  HOME_NAVIGATION_REF,
  VIEW_REPORT_NAVIGATION_REF,
  REPORT_NAVIGATION_REF,
};
