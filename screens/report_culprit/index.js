import React from 'react';
import { ScrollView, SafeAreaView, Dimensions, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { 
  TextInput, 
  Divider, 
  List, 
  FAB, 
  Surface, 
  Text,
  Caption 
} from 'react-native-paper';
import { API } from '../../utilities';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class ReportCulprit extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      date: new Date().getTime(),
      culpritName: "",
      culpritNameError: false,
      reportersName: "",
      reportersNameError: false,
      reportersEmail: "",
      reportersEmailError: false,
      reportersPhone: "",
      reportersPhoneError: false,
      userID: "",
    };
  }

  async componentDidMount() {
    let userID = (await AsyncStorage.getItem("userID"));

    this.setState({userID});
  }

  _setCulpritsName = (culpritName) => this.setState({culpritName});

  _setAdditionalInformation = () => {}

  _setReportersName = (reportersName) => this.setState({reportersName});

  _setReportersEmail = (reportersEmail) => this.setState({reportersEmail});

  _setReportersPhone = (reportersPhone) => this.setState({reportersPhone});

  _verifyInformation = () => {
    let validName = /\w+/gi;
    let validEmail = /\S+@\w+(\.\w+)*(\.\w+)/;
    let validPhone = /0\d{9}|\+254\d{9}/;

    let verified = true;

    if(!validName.test(this.state.culpritName)) {
      this.setState({culpritNameError: true});
      verified = false;
    }

    if(!validName.test(this.state.reportersName)) {
      this.setState({reportersNameError: true});
      verified = false;
    }

    if(!validEmail.test(this.state.reportersEmail)) {
      this.setState({reportersEmailError: true});
      verified = false;
    }
    
    if(!validPhone.test(this.state.reportersPhone)) {
      this.setState({reportersPhoneError: true});
      verified = false;
    }

    return verified;
  }

  _generateReport = () => {
    
    if(this._verifyInformation()) {
      let culprit = {
        name: this.state.culpritName
      };

      let reporter = {
        name: this.state.reportersName,
        email: this.state.reportersEmail,
        phoneNo: this.state.reportersPhone
      };

      let data = {
        culprit,
        reporter,
        highlightedMedia: this.props.route.params.highlightedMediaUrl,
        userID: this.state.userID
      };

      Alert.alert(
        "Confirm culprit",
        "The information you have entered here is sensitive and will be subject to confirmation from our partner orgainisations.Please confirm submitting this information",
        [
          {
            text: "Confirm",
            onPress: () => {
              API.sendCulpritInformation(
                this.props.route.params.report._id, 
                data,
                (data) => {
                  ToastAndroid.show("Culprit information added", ToastAndroid.SHORT);
                  this.props.navigation.goBack();
                }, 
                () => {
                  this.props.navigation.goBack();
                }
              );
            }
          },
          {
            text: "Cancel",
            onPress: () => {
            }
          }
        ]
      );
    }

  }

  render() {

    return (
      <ScrollView style={styles.screen}>
        <Surface>
          <Icon name="link" style={styles.mediaIcon} size={50} />
          <Text style={styles.linkText} >{this.props.route.params.highlightedMediaUrl.replace("localhost", "192.168.43.89")}</Text>
        </Surface>
        <Divider />
        <List.Section title="Culprit information"/>
        <TextInput 
          style={styles.textInput}
          value={this.state.culpritName}
          onChangeText={this._setCulpritsName}
          label="Culprit's name"
          placeholder="Enter culprit's name here"
        />
        <Divider />
        <List.Section title="Your information" />
        <TextInput 
          style={styles.textInput}
          value={this.state.reportersName}
          onChangeText={this._setReportersName}
          label="Your name"
          placeholder="Enter your name here"
        />
        <TextInput 
          style={styles.textInput}
          value={this.state.reportersEmail}
          onChangeText={this._setReportersEmail}
          label="Your email"
          placeholder="email@example.com"
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.textInput}
          value={this.state.reportersPhone}
          onChangeText={this._setReportersPhone}
          label="Phone Number"
          placeholder="+2547XXXXXXX"
          keyboardType="phone-pad"
        />
        <FAB 
          style={styles.fab}
          label={"submitDescription"}
          onPress={this._generateReport}
        />
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  mediaIcon: {
    alignSelf: "center",
    marginBottom: 8,
    marginTop: 8
  },
  linkText: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 16,
  },
  textInput: {
    width: Dimensions.get("window").width - 32,
    alignSelf: "center",
    marginBottom: 8,
  },
  fab: {
    width: Dimensions.get("window").width - 64,
    alignSelf: "center"
  },
});
