import React from 'react';
import {
  StatusBar,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { FAB } from 'react-native-paper';

import Theme from '../../../theme';


export default class FinishScreen extends React.PureComponent {

  /**navigates to the Login screen */
  _navigateToLogin = () => this.props.navigation.navigate("Login")

  /** navigates to the SignUp screen */
  _navigateToSignUp = () => this.props.navigation.navigate("SignUp")

  render() {

    return (
        <SafeAreaView style={styles.screen}>
          <Text style={styles.newText}>New Here?</Text>
          <FAB 
            style={styles.fab}
            label="sign up"
            icon="chevron-right"
            onPress={this._navigateToSignUp}
          />
          <Text style={styles.alreadySignedUpText}>
            Already have an account?
            <Text 
                style={styles.loginText} 
                onPress={this._navigateToLogin}>
              {"  Login"}
            </Text>
          </Text>
        </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.PrimaryColor,
    flex: 1,
    alignSelf: "stretch",
  },
  newText: {
    color: "white",
    fontSize: 18,
    fontFamily: Theme.OpenSansBold,
  },
  fab: {
    width: Dimensions.get("window").width - 64,
    marginTop: 16,
    marginBottom: 8,
  },
  alreadySignedUpText: {
    color: "white",
    fontSize: 18,
    fontFamily: Theme.OpenSansBold,
    marginTop: 32,
  },
  loginText: {
    color: "#fb8c00"
  },
});
