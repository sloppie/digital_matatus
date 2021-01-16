import 'react-native-gesture-handler'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';

import SplashScreen from './routes';
import AsyncStorage from '@react-native-community/async-storage';
import NotificationsSetup from './utilities/push-notifications';
import { StatusBar } from 'react-native';

class App extends React.Component {

  async componentDidMount() {
    let deviceToken = (await AsyncStorage.getItem("deviceNotificationToken", (err) => console.log(err)));

    if(deviceToken == null) {
      NotificationsSetup.configure();
    }

  }

  render() {
    return (
      <>
      <StatusBar backgroundColor="#800080bb" />
      <NavigationContainer>
        <PaperProvider>
          <SplashScreen />
        </PaperProvider>
      </NavigationContainer>
      </>
    );
  }

}


export default App;
