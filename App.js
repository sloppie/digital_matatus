import 'react-native-gesture-handler'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native'

import SplashScreen from './routes';
// import AsyncStorage from '@react-native-community/async-storage';
// import NotificationsSetup from './utilities/push-notifications';
// import { Notifications } from 'react-native-notifications';


class App extends React.Component {

  componentDidMount() {
    // let deviceToken = (await AsyncStorage.getItem("deviceNotificationToken", (err) => console.log(err)));
    // console.log("device token" + deviceToken)

    // if(!deviceToken) {
    //   NotificationsSetup.configure();
    // } else {
    //   Notifications.postLocalNotification({title: "Test", body: "This us the body"});
    //   // NotificationsSetup.pushLocalNotification({title: "Test", message: "test 1"})
    // }

  }

  render() {
    return (
      <NavigationContainer>
          <SplashScreen />
      </NavigationContainer>
    );
  }

}


export default App;
