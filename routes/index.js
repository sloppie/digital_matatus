import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/splash_screen';
import HomeStack from './HomeStack';
import ConfigStack from './ConfigStack';
import { APP_STORE } from '..';
import { CONFIG_COMPLETE } from '../store';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

isLoggedIn = false;


class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, // init splash screen
      isLoggedIn: true, // irrelevant
      configComplete: false, // checks whether the user has stored configs
      authProccessRan: false, // this is a primitive way of ensuring the auth proc doesnt run twice
    };

  }

  componentDidMount() {
    this.auth();
  }

  setConfig = () => {
    this.setState({
      isLoggedIn: true,
      configComplete: true
    });
  }

  auth = async () => {
    if(this.state.authProccessRan)
      return;

    try {
      let configComplete = JSON.parse(await AsyncStorage.getItem("isConfig"));

      if(configComplete == true) {
        this.setState({
          isLoading: false,
          configComplete: true
        });
      } else {
        this.componentID = APP_STORE.subscribe(CONFIG_COMPLETE, this.setConfig.bind(this));
        this.setState({
          isLoading: false,
          configComplete: false
        });
      }
      
    } catch(err) {
      this.setState({
        isLoading: false,
        configComplete: false
      });
    }

    this.setState({authProccessRan: true})
  }

  render() {

    if(this.state.isLoading)
      return <SplashScreen />

    if(!this.state.configComplete)

      return (
        <Stack.Navigator>
          <Stack.Screen 
            name="Welcome"
            component={ConfigStack}
            options={{headerShown: false, title: ""}}
          />
        </Stack.Navigator>
      );
    else if(this.state.isLoggedIn && this.state.configComplete) {

      if(typeof this.componentID == "string")
        APP_STORE.unsubscribe(CONFIG_COMPLETE, this.componentID); // this is no longer needed

      return (
        <HomeStack />
      );
    }

  }

}

export default App;