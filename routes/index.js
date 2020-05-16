import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/splash_screen';
import HomeStack from './HomeStack';
import ConfigStack from './ConfigStack';

const Stack = createStackNavigator();

isLoggedIn = false;


class App extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isLoggedIn: true
    };

  }

  auth = () => {
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 3000);
  }

  render() {
    this.auth();

    if(this.state.isLoading)
      return <SplashScreen />
  
    return (
        <Stack.Navigator initialRouteName="SplashScreen">
          { isLoggedIn? 
            <>
              <Stack.Screen 
                name="Home"
                component={HomeStack}
                options={{title: "", headerTransparent: true}}
              />
            </>
          :
            <Stack.Screen name="Welcome" component={ConfigStack}/>
          }
        </Stack.Navigator>
    );
  }

}

export default App;