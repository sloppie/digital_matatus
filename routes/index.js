import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SplashScreen, LoginScreen } from '../screens';
// import HomeStack from './HomeStack';
import AppDrawer from './AppDrawer';
import ConfigStack from './ConfigStack';

// store and events from store
import { APP_STORE } from '..';
import { CONFIG_COMPLETE } from '../store';

// storage
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
      isNewUser: false, // if so pushes to Welcom Screen
      isLegacyUser: false // if so pushes to the Login screen
    };

  }

  componentDidMount() {
    this.auth();
    this.componentID = APP_STORE.subscribe(CONFIG_COMPLETE, this.setConfig);
  }

  _setUserType = (type) => (type == "NEW")? this.setState({isNewUser: true}): this.setState({isLegacyUser: true});

  setConfig = () => {
    this.setState({
      isLoggedIn: true,
      configComplete: true,
    });
    console.log("CONFIGURATION IS COMPLETE");
    AsyncStorage.setItem("isConfig", JSON.stringify(true));
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

  _renderLogin = () => {

    if(LoginScreen == null)
      LoginScreen = require('../screens').LoginScreen;
    
    return (
      <LoginScreen 
        _setUserType={this._setUserType}
      />
    );
  }

  render() {

    if(this.state.isLoading)
      return <SplashScreen />
    
    if(!this.state.configComplete) {
      return (
        <ConfigStack />
      )
    }


    if(typeof this.componentID == "string")
      APP_STORE.unsubscribe(CONFIG_COMPLETE, this.componentID); // this is no longer needed

    return (
      <AppDrawer />
    );

  }

}

export default App;