import 'react-native-gesture-handler'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from './routes';
import AsyncStorage from '@react-native-community/async-storage';
import NotificationsSetup from './utilities/push-notifications';

class App extends React.Component {

  async componentDidMount() {
    let deviceToken = (await AsyncStorage.getItem("deviceNotificationToken", (err) => console.log(err)));

    if(deviceToken == null) {
      NotificationsSetup.configure();
    }

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
