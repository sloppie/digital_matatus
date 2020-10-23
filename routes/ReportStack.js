import React from 'react'; 
import { View, DeviceEventEmitter } from 'react-native'; 
import { createStackNavigator } from '@react-navigation/stack';
// import { 
//   Report, 
//   CategoryDefinition, 
//   SetReminder, 
//   NumberPlate, 
//   Camera 
// } from './../screens';

import Report from '../screens/report_v2';
import CategoryDefinition from '../screens/harrasment_def';
import SetReminder from '../screens/set_reminder';
import NumberPlate from '../screens/number_plate';
import Camera from '../screens/camera';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { REPORT_NAVIGATION_REF } from './AppDrawer';

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

// We'll probably have to use events for the onPress on the Icons
// The icons will emit an event when fired and the camera will respond
// causing to either fire a video recording, or a picture capture
function RightIcons() {
  // FIRE_UP_CAMERA payload tells whether it'll be video or picture
  const launchCamera = (type) => {
    DeviceEventEmitter.emit("LAUNCH_CAMERA", type);
  }

  return (
    <View style={{flexDirection: "row", justifyContent: "center"}}>
      <Icon 
        onPress={launchCamera.bind(this, "video")}
        style={{padding: 8, marginEnd: 8}}
        name="video-outline"
        color="white"
        size={30}
      />
      <Icon 
        onPress={launchCamera.bind(this, "camera")}
        style={{padding: 8, alignSelf: "center", marginEnd: 8}}
        name="camera-outline"
        color="white"
        size={24}
      />
    </View>
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
        headerRight: RightIcons,
      }}
    />
    <Stack.Screen 
      name="Camera" 
      component={Camera} 
      options={{
        // unmountOnBlur: true,
        headerShown: false,
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