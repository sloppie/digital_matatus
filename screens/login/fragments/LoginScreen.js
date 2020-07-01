import React from 'react';
import { 
  SafeAreaView, 
  View, 
  Dimensions, 
  StyleSheet, 
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import { 
  Title, 
  TextInput, 
  FAB, 
  Button, 
  TouchableRipple, 
  Caption, 
  List, 
  Card, 
  Colors
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../../theme';
import { API } from '../../../utilities';


export default class Login extends React.PureComponent {

  emailRegEx = /\S+@\w+(\.\w+)*(\.\w+)/;

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      isValidEmail: false,
      loading: false,
      fetching: false
    };

  }

  _handleChange = (email) => this.setState({email});

  _goToSignUp = () => this.props.navigation.navigate("SignUp")

  _fetchDetails = () => {
    this.setState({fetching: true});

    if(!this.emailRegEx.test(this.state.email)) {
      this.setState({isValidEmail: false});
      return;
    }

    // callback to be executed once the User details are loaded successfully
    const onLoginDetailsSuccess = (payload) => {
      payload.email = this.state.email;
      this.setState({ fetching: false }); 
      // this.props._setUserDetails(payload);
      this.props.navigation.navigate("Confirm", {user: payload});

    }

    // callback to be executed is the user details are not loaded
    const onLoginDetailsError = () => {
      ToastAndroid.show("Unable to fetch user details", ToastAndroid.SHORT);
    }

    // callback to be executed if user is found
    const isUserCallBack = () => {
      API.getLoginDetails(this.state.email, onLoginDetailsSuccess, onLoginDetailsError);
    }

    // callback to be executed if the user is not found
    const isNotUserCallback = (payload) => {
      ToastAndroid.show(payload, ToastAndroid.SHORT);
    }
    
    // validate user
    API.isUser(this.state.email, isUserCallBack, isNotUserCallback);
  }

  render() {

    return (
      <SafeAreaView style={styles.screen}>
        <Title style={styles.screenLabel}>Sign in</Title>
        <View style={styles.loginContainer}>
          <TextInput 
            disabled={this.state.loading}
            mode="flat"
            label="email"
            placeholder="this@example.com"
            style={styles.textInput}
            value={this.state.email}
            onChangeText={this._handleChange}
            theme={Theme.AppTheme}
            underlineColor="white"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          
            <FAB 
              disabled={!this.emailRegEx.test(this.state.email)}
              color={Colors.white}
              style={styles.fab}
              label="login"
              onPress={this._fetchDetails}
              loading={this.state.fetching}
            />
        </View>
          {/* <View style={styles.buttonContainer}> */}
              <Caption style={styles.haveAccountText}>
                Don't have an account yet?
                {/* <Caption 
                  style={styles.signInText} 
                  onPress={this._setUserType}
                >
                  {" Sign Up"}
                </Caption> */}
              </Caption>
              {/* <TouchableRipple
                onPress={this._setUserType}
              >
              </TouchableRipple> */}
              <Button
                title="sign up"
                color="white"
                style={styles.loginButton}
                onPress={this._goToSignUp}
                label="sign up"
              >sign up</Button>
          {/* </View> */}
          {
          (this.state.loading)
          ? <ActivityIndicator 
              size={"small"}
              color="white"
              style={styles.activityIndicator}
            />
          : null
          }
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    width: Dimensions.get("window").width,
    backgroundColor: Theme.PrimaryColor,
  },
  screenLabel: {
    marginTop: 16,
    fontSize: 30,
    marginLeft: 16,
    fontFamily: Theme.OpenSansBold,
    color: "white"
  },
  loginContainer: {
    height: "70%",
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 16,
    backgroundColor: Theme.PrimaryColor,
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    // position: "absolute",
    // bottom: 0,
    // start: 0,
    backgroundColor: "white"
  },
  fab: {
    position: "relative",
    marginTop: 24,
    width: (Dimensions.get("window").width - 96),
    bottom: 0,
  },
  haveAccount: {
    flexDirection: "row",
    width: (Dimensions.get("window").width - 32),
    alignSelf: "flex-end",
  },
  haveAccountText: {
    textAlignVertical: "center",
    fontSize: 14,
    // color: Colors.blue700,
    textAlign: "center",
    // bottom: 32,
    fontWeight: "700"
  },
  signInText: {
    textAlignVertical: "center",
    fontSize: 14,
    // color: Colors.blue700,
    color: "white",
    textAlign: "center",
    bottom: 32,
    fontWeight: "700",
    padding: 8,
  },
  loginButton: {
    padding: 0,
    backgroundColor: Theme.PrimaryColor,
    elevation: 0,
    zIndex: 0,
  },
  activityIndicator: {
    color: "white",
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
});
