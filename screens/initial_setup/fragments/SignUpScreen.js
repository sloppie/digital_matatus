import React from 'react';
import { SafeAreaView, Dimensions, StyleSheet, ToastAndroid } from 'react-native';
import { TextInput, FAB } from 'react-native-paper';


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
        <TextInput 
          mode="outlined"
          style={styles.textInput}
          value={this.state.email}
          label="email"
          placeholder="example@example.com"
          onChangeText={this._handleChange}
        />
        
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
  },
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center"
  },
  fab: {
    position: "absolute",
    bottom: 16,
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center"
  },
});
