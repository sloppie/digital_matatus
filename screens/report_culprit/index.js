import React from 'react';
import { SafeAreaView, Dimensions, StyleSheet, Alert } from 'react-native';
import { 
  TextInput, 
  Divider, 
  List, 
  FAB, 
  Surface, 
  Caption 
} from 'react-native-paper';
import { API } from '../../utilities';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-vector-icons/Icon';


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
        highlightedMedia: this.props.routes.params.highlightedMediaUrl,
        userID: this.state.userID
      };

      Alert.alert(
        "Confirm culprit",
        "The information you have entered here is sensitive and will be subject to confirmation from our partner orgainisations.Please confirm submitting this information",
        [
          {
            text: "Confirm",
            onPress: () => {
              API.sendCulpritInformation(this.props.routes.params.report._id, data);
            }
          },
        ]
      );
    }

  }

  render() {

    return (
      <SafeAreaView style={styles.screen}>
        <Surface>
          <Icon name="video" />
          <Caption>{this.props.routes.params.highlightedMediaUrl}</Caption>
        </Surface>
        <Divider />
        <List.Section title="Culprit information"/>
        <TextInput 
          style={styles.textInput}
          value={this.state.culpritName}
          onChangeText={this._setCulpritsName}
        />
        <Divider />
        <List.Section title="Your information" />
        <TextInput 
          style={styles.textInput}
          value={this.state.reportersName}
          onChangeText={this._setReportersName}
        />
        <TextInput 
          style={styles.textInput}
          value={this.state.reportersEmail}
          onChangeText={this._setReportersEmail}
        />
        <TextInput 
          style={styles.textInput}
          value={this.state.reportersPhone}
          onChangeText={this._setReportersPhone}
        />
        <FAB 
          label={submitDescription}
        />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    width: Dimensions.get("window").width,
  },
  textInput: {
    width: Dimensions.get("window").width - 32,
    alignSelf: "center",
    marginBottom: 8,
  },
});
