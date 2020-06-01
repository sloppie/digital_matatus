import React from 'react';
import { SafeAreaView, View, Dimensions, StyleSheet, ToastAndroid } from 'react-native';
import { TextInput, FAB, TouchableRipple, Caption, List, Card, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


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

  _setUserType = () => this.props._setUserType("NEW");

  _handleChange = (email) => this.setState({email});

  _fetchDetails = () => {
    console.log("button pressed")

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
          <TextInput 
            mode="outlined"
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
            />
          <View style={styles.buttonContainer}>
            <TouchableRipple
              onPress={this._setUserType}
            >
              {/* <View 
                style={styles.haveAccount}
              >
                <Icon name="information" />
                <Caption>Have used DigitalMatatus before</Caption>
                left={props => <Icon name="information" size={24}/>}
              </View> */}
              <Card.Title
                style={styles.haveAccount}
                title="Have used DigitalMatatus before?"
                titleStyle={styles.haveAccountText}
                subtitle="Press here if you already have used DigitalMatatus"
              />
            </TouchableRipple>
          </View>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    width: Dimensions.get("window").width,
  },
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center"
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0,
    start: 0,
    backgroundColor: "white"
  },
  fab: {
    position: "absolute",
    bottom: 70,
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
  },
  haveAccount: {
    flexDirection: "row",
    width: (Dimensions.get("window").width - 32),
    alignSelf: "flex-end",
  },
  haveAccountText: {
    textAlignVertical: "center",
    fontSize: 14,
    color: Colors.blue700,
    // textAlign: "center"
  },
});

