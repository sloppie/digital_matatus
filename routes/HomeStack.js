import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Home';

import Theme from '../theme';

// inline requires
/**@type {RouteDetails} */
let RouteDetailsScreen = null;

/**@type {NumberPlate}*/ 
let NumberPlateScreen = null;

/**@type {ReportDetails}*/
let ReportDetailsScreen = null;

/**@type {MediaView}*/
let MediaViewScreeen = null;

/**@type {ReportCulprit} */
let ReportCulpritScreen = null;

/**@type {Camera} */
let CameraScreen = null;

const Stack = createStackNavigator();

/**
 * This function runs after the initial import of the `Home` screen. This is however
 * bottlenecked by 1 second to allow for the Home screen to finish working on the JS thread.
 * This uses promises to run the promises asynchronously.
 * 
 * @returns {Promise<boolean>} returns a boolean about the state of the importing
 */
const importScreens = () => new Promise((resolve, reject) => {
  // bottlenecked the imports as they are somehow "instantaneous"
  setTimeout(() => {
    CameraScreen = require('../screens/camera').default;
    RouteDetailsScreen = require('../screens/route_details').default;
  }, 1000);

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

function NumberPlate(props) {
  if(NumberPlateScreen === null)
    NumberPlateScreen = require('../screens/number_plate').default;

  return <NumberPlateScreen {...props} />
}

function ReportDetails(props) {
  if(ReportDetailsScreen === null)
    ReportDetailsScreen = require('../screens/report_details').default;

  return <ReportDetailsScreen {...props} />;
}

function MediaView(props) {
  if(MediaViewScreeen === null)
    MediaViewScreeen = require('../screens/media_view').default;
  
  return <MediaViewScreeen {...props} />;
}

function ReportCulprit(props) {
  if(ReportCulpritScreen === null)
    ReportCulpritScreen = require('../screens/report_culprit').default;

  return <ReportCulpritScreen {...props} />;
}

function Camera(props) {
  if(CameraScreen === null)
    CameraScreen = require('../screens/camera').default;
  
  return <CameraScreen {...props} />;
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
