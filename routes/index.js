import React from 'react';

// import LoginScreen from '../screens/login';
// import HomeStack from './HomeStack';
import AppDrawer from './AppDrawer';
import SplashScreen from '../screens/splash_screen';

// store and events from store
import { APP_STORE } from '..';
import { CONFIG_COMPLETE } from '../store';

// storage
import AsyncStorage from '@react-native-community/async-storage';

// inline requires
let ConfigStack = null;
let LoginScreen = null;

isLoggedIn = false;


class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      configComplete: false,
      authProccessRan: false, // this is a primitive way of ensuring the auth proc doesnt run twice
      isNewUser: false, // if so pushes to Welcom Screen
      isLegacyUser: false // if so pushes to the Login screen
    };

  }

  componentDidMount() {
    this.componentID = APP_STORE.subscribe(CONFIG_COMPLETE, this.setConfig);
    this.auth();
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
      LoginScreen = require('../screens/login').LoginScreen;
    
    return (
      <LoginScreen 
        _setUserType={this._setUserType}
      />
    ); 
  }

  _renderConfigStack = () => {
    console.log("Rendering config stack");

    if(ConfigStack === null)
      ConfigStack = require('./ConfigStack').default;

    return <ConfigStack />
  }

  render() {
    const headerHeight = 56;

    if(this.state.isLoading)
      return <SplashScreen headerHeight={headerHeight} />
    
    if(!this.state.configComplete) {
      return this._renderConfigStack();
    }


    if(typeof this.componentID == "string")
      APP_STORE.unsubscribe(CONFIG_COMPLETE, this.componentID); // this is no longer needed

    return (
      <AppDrawer />
    );

  }

}

export default App; 