import React from 'react';
import { SafeAreaView, View, Dimensions, StyleSheet, ToastAndroid } from 'react-native';
import { Title, TextInput, FAB, TouchableRipple, Caption, List, Card, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../../theme';


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

  _setUserType = () => this.props._setUserType("NEW");

  _handleChange = (email) => this.setState({email});

  _fetchDetails = () => {
    this.setState({fetching: true});

    if(!this.emailRegEx.test(this.state.email)) {
      this.setState({isValidEmail: false});
      return;
    }
    
    fetch(`http://192.168.43.89:3000/api/user/isUser/${this.state.email}`)
      .then(data => data.json())
      .then(response => {

      try {

        if(JSON.parse(response)) {
          fetch(
            `http://192.168.43.89:3000/api/user/login?email=${this.state.email}`, 
            {
              method: "GET",
            }
          ).then(data => data.json()).then(response => {

            console.log(response)
            if(response) {
              let data = response;
              data.email = this.state.email;
              this.props._setUserDetails(data);
              this.setState({fetching: false});
            }

          }).catch(err => {
            console.log(err);
            ToastAndroid.show("Unable to fetch user details", ToastAndroid.SHORT);
          });
        }

      } catch(err) {
        console.log("Unable to parse output");
        ToastAndroid.show("Oops! An error ocurred", ToastAndroid.SHORT);
      }

    }).catch(err => { // failed to validate email
      console.log(err);
      ToastAndroid.show("Error fetching data, check internet connection", ToastAndroid.SHORT);
    });
  }

  render() {

    return (
      <SafeAreaView style={styles.screen}>
        <Title style={styles.screenLabel}>Sign in</Title>
        <View style={styles.loginContainer}>
          <TextInput 
            mode="flat"
            label="email"
            placeholder="this@example.com"
            style={styles.textInput}
            value={this.state.email}
            onChangeText={this._handleChange}
          />
          
            <FAB 
              disabled={!this.emailRegEx.test(this.state.email)}
              color={Colors.blue700}
              style={styles.fab}
              label="login"
              onPress={this._fetchDetails}
              loading={this.state.fetching}
            />
        </View>
          <View style={styles.buttonContainer}>
              <Caption style={styles.haveAccountText}>
                Have an acount already?
                <Caption 
                  suppressHighlighting={true} 
                  style={styles.signInText} 
                  onPress={this._setUserType}
                >
                  {" Sign In"}
                </Caption>
              </Caption>
          </View>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    width: Dimensions.get("window").width,
    backgroundColor: "white"
  },
  screenLabel: {
    marginTop: 16,
    fontSize: 30,
    marginLeft: 16,
    fontFamily: Theme.OpenSansBold,
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
    backgroundColor: "white",
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0,
    start: 0,
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
    bottom: 32,
    fontWeight: "700"
  },
  signInText: {
    textAlignVertical: "center",
    fontSize: 14,
    color: Colors.blue700,
    textAlign: "center",
    bottom: 32,
    fontWeight: "700"
  }
});

