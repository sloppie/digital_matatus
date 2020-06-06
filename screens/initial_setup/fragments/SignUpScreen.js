import React from 'react';
import { SafeAreaView, View, Dimensions, StyleSheet, ToastAndroid } from 'react-native';
import { TextInput, Title, FAB } from 'react-native-paper';
import Theme from '../../../theme';


export default class Login extends React.PureComponent {

  emailRegEx = /\S+@\w+(\.\w+)*(\.\w+)/;

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      isValidEmail: false,
      loading: false
    };

  }

  _handleChange = (email) => this.setState({email});

  _finalise = () => {
    
    if(this.emailRegEx.test(this.state.email)) {
      this.props._finalise(this.state.email);
    }

  }

  render() {

    return (
      <SafeAreaView style={styles.screen}>
        <Title style={styles.screenLabel}>Sign up</Title>
        <View style={styles.loginContainer}>
        <TextInput 
          style={styles.textInput}
          value={this.state.email}
          label="email"
          placeholder="example@example.com"
          onChangeText={this._handleChange}
            theme={Theme.AppTheme}
            underlineColor="white"
            keyboardType="email-address"
            textContentType="emailAddress"
        />
        </View>
        
        <FAB 
          style={styles.fab}
          disabled={!this.emailRegEx.test(this.state.email)}
          label="Sign Up"
          loading={this.state.loading}
          onPress={this._finalise}
        />
      </SafeAreaView>
    ); 
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    width: (Dimensions.get("window").width),
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
    alignItems: "center",
  },
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 16,
    backgroundColor: Theme.PrimaryColor,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center"
  }, 
});
