import 'react-native-gesture-handler'
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native'

import SplashScreen from './routes';


class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );
  }

}

const styles = StyleSheet.create({
});

export default App;
