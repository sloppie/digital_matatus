import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import LoginScreen from './LoginScreen';
import ConfirmScreen from './Confirm';


const MaterialTopTabNavigator = createMaterialTopTabNavigator();



export default class Tab extends React.PureComponent {

  renderLoginScreen = () => (
    <LoginScreen 
      secondaryNavigation={this.props.secondaryNavigation}
    />
  );

  renderConfirmScreen = () => (
    <ConfirmScreen 
      secondaryNavigation={this.props.secondaryNavigation}
    />
  );

  render() {

    return (
     <MaterialTopTabNavigator.Navigator
       tabBar={() => null}
       lazy={true}
       swipeEnabled={false}
     >
       <MaterialTopTabNavigator.Screen 
         name="Login"
         component={LoginScreen}
       />
       <MaterialTopTabNavigator.Screen 
         name="Confirm"
         component={ConfirmScreen}
       />
     </MaterialTopTabNavigator.Navigator>
   );
  }
}
