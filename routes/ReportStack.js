import React from 'react'; 
import { View, DeviceEventEmitter } from 'react-native'; 
import { createStackNavigator } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { REPORT_NAVIGATION_REF } from './AppDrawer';

import ReportScreen from '../screens/report_v2';


let CategoryDefinitionScreen = null;
let SetReminderScreen = null;
let NumberPlateScreen = null;
let CameraScreen = null;


/**
 * This function runs after the initial import of the `Report` screen. This is however
 * bottlenecked by 1 second to allow for the `Home` screen to finish working on the JS thread.
 * This uses promises to run the promises asynchronously.
 * 
 * @returns {Promise<boolean>} returns a boolean about the state of the importing
 */
const importScreens = async () => new Promise((resolve, reject)=> {
    setTimeout(() => {
      CameraScreen = require('../screens/camera').default;
      CategoryDefinitionScreen = require('../screens/harrasment_def').default;
    }, 1000);

    resolve(true);
});


/**@returns {Report} */
function Report(props) {
  importScreens();
  
  return <ReportScreen {...props} />
}


/**@returns {Report} */
function CategoryDefinition(props) {
  if(CategoryDefinitionScreen === null)
    CategoryDefinitionScreen = require('../screens/harrasment_def').default;

  return <CategoryDefinitionScreen {...props} />
}


/**@returns {Report} */
function SetReminder(props) {
  if(SetReminderScreen === null)
    SetReminderScreen = require('../screens/set_reminder').default;

  return <SetReminderScreen {...props} />;
}


/**@returns {Report} */
function NumberPlate(props) {
  if(NumberPlateScreen === null)
    NumberPlateScreen = require('../screens/number_plate').default;
  
  return <NumberPlateScreen {...props} />;
}


/**@returns {Report} */
function Camera(props) {
  if(CameraScreen === null)
    CameraScreen = require('../screens/camera').default;
  
  return <CameraScreen {...props} />;
}


/**@returns {Report} */
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

/**
 * @todo We'll probably have to use events for the onPress on the Icons
 * The icons will emit an event when fired and the camera will respond
 * causing to either fire a video recording, or a picture capture
 * 
 * @returns {JSX.Element} the `Icons` for the Right side of the Report screen
 */
function RightIcons() {

  /**
   * Fires up the camera of the type declared in the param. This is done using emittion
   * of event wich forces the camera to be fired up in the `Report` screen
   * 
   * @param {"camera" | "video"} type this is the type of the camera thath wil be fired up,
   *                                  this is either firing up the camera for `video` or for `photo`
   * 
   * @returns {void}
   */
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
        backgroundColor: "purple",
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