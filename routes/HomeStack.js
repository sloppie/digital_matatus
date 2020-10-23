import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Home';
// import RouteDetails from '../screens/route_details';
// import NumberPlate from '../screens/number_plate';
// import ReportDetails from '../screens/report_details';
// import MediaView from '../screens/media_view';
// import ReportCulprit from '../screens/report_culprit';
// import Camera from '../screens/camera';

import Theme from '../theme';

// inline requires
let RouteDetailsScreen = null;
let NumberPlateScreen = null;
let ReportDetailsScreen = null;
let MediaViewScreeen = null;
let ReportCulpritScreen = null;
let CameraScreen = null;

const Stack = createStackNavigator();

// these are the two most likely screens thus we eagerly load them in the background
// after the HomeScreen starts loading
const importScreens = () => new Promise((resolve, reject) => {
  CameraScreen = require('../screens/camera').default;
  RouteDetailsScreen = require('../screens/route_details').default;
  resolve(true);
});

function Home(props) {
  importScreens();

  return <HomeScreen {...props} />
}

function RouteDetails(props) {
  if(RouteDetailsScreen === null)
    RouteDetailsScreen = require('../screens/route_details').default;
  
  return <RouteDetailsScreen {...props} />
}

function NumberPlate() {
  if(NumberPlateScreen === null)
    NumberPlateScreen = require('../screens/number_plate').default;

  return <NumberPlateScreen />
}

function ReportDetails() {
  if(ReportDetailsScreen === null)
    ReportDetailsScreen = require('../screens/report_details').default;

  return <ReportDetailsScreen />;
}

function MediaView() {
  if(MediaViewScreeen === null)
    MediaViewScreeen = require('../screens/media_view').default;
  
  return <MediaViewScreeen />;
}

function ReportCulprit() {
  if(ReportCulpritScreen === null)
    ReportCulpritScreen = require('../screens/report_culprit').default;

  return <ReportCulpritScreen />;
}

function Camera() {
  if(CameraScreen === null)
    CameraScreen = require('../screens/camera').default;
  
  return <CameraScreen />;
}

export default () => (
  <Stack.Navigator
    screenOptions={{
    }}
    initialRouteName="Home"
  >
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
      name="MediaView"
      component={MediaView}
      options={{
        headerTransparent: true,
        title: "Preview",
      }}
    />
    <Stack.Screen 
      name="ReportCulprit" 
      component={ReportCulprit} 
      options={{
        headerStyle: {elevation: 1},
      }} 
    />
  </Stack.Navigator>
);
