import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStack from './HomeStack';
import { useEffect } from 'react';

// inline requires
let ReportStack = null;
let ReportViewStack = null;
let AppTutorial = null;

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

function AppTutorialIcon({color, size, focused}) {

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
  if(HomeStack === null)
    HomeStack = require('./HomeStack').default;


  return <HomeStack />
}

function Report(props) {
  REPORT_NAVIGATION_REF = props.navigation;

  if(ReportStack === null)
    ReportStack = require('./ReportStack').default;

  return <ReportStack />
}

function ReportV2(props) {
  REPORT_NAVIGATION_REF = props.navigation;

  return <ReportStackV2 />
}

function ViewReports(props) {
  VIEW_REPORT_NAVIGATION_REF = props.navigation;

  if(ReportViewStack === null)
    ReportViewStack = require('./ReportViewStack').default;

  return <ReportViewStack />
}

function ViewTutorial(props) {
  if (AppTutorial == null)
    AppTutorial = require("../screens/app_tutorial").default;

  return <AppTutorial {...props} />;
}

// REFS
let HOME_NAVIGATION_REF;
let REPORT_NAVIGATION_REF;
let VIEW_REPORT_NAVIGATION_REF;

const AppDrawer = createDrawerNavigator();

export default () => {

  let [initRender, setInitRender] = useState(true);

  useEffect(() => {
    setInitRender(false);
  }, []);

  return (
    <AppDrawer.Navigator
      initialRouteName="Home"
      minSwipeDistance={30}
      edgeWidth={100}
      backBehavior="initialRoute"
      drawerStyle={[{backgroundColor: "#a143a1"}, (initRender)? {width: null}: null]}
      drawerContentOptions={{activeBackgroundColor: "white", inactiveTintColor: "white"}}
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
          unmountOnBlur: true,
          drawerIcon: (props) => <ReportIcon {...props} />
        }}
      />
      <AppDrawer.Screen 
        name="ViewReports"
        component={ViewReports}
        options={{
          drawerIcon: (props) => <ViewReportsIcon {...props} />
        }}
      />
      <AppDrawer.Screen 
        name="AppTutorial"
        component={ViewTutorial}
        options={{
          drawerIcon: (props) => <AppTutorialIcon {...props} />
        }}
      />
    </AppDrawer.Navigator>
  );
}
export {
  HOME_NAVIGATION_REF,
  VIEW_REPORT_NAVIGATION_REF,
  REPORT_NAVIGATION_REF,
};
