import React from 'react';
import { SafeAreaView, StyleSheet, Dimensions, ToastAndroid } from 'react-native';
import { TextInput, FAB, Caption } from 'react-native-paper';
import { API } from '../../utilities';
import AsyncStorage from '@react-native-community/async-storage';


export default class NumberPlateReminder extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      numberPlate: "",
      conspicuous: "",
      saccoName: "",
      report_id: "",
    };
  }

  async componentDidMount() {
    let reportToUpdate = JSON.parse(await AsyncStorage.getItem("reportToUpdate"));

    this.setState({report_id: reportToUpdate});
  }

  _setNumberPlate = (numberPlate) => this.setState({numberPlate: numberPlate.toUpperCase()});

  _setConspicuousDetails = (conspicuous) => this.setState({conspicuous});

  _setSaccoName = (saccoName) => this.setState({saccoName});

  _sendNewDetails = () => {
    
    if(/[A-Z]{3}\s\d{3}[A-Z]/.test(this.state.numberPlate)) {
      let {numberPlate, conspicuous, saccoName} = this.state;

      let matatuDetailsObj = {
        numberPlate
      };

      if(conspicuous !== "")
        matatuDetailsObj["conspicuous"] = conspicuous;
      
      if(saccoName)
        matatuDetailsObj["saccoName"] = saccoName;

      const onSuccess = () => {
        AsyncStorage.setItem("reportToUpdate", JSON.stringify(""));
        ToastAndroid.show("Data updated", ToastAndroid.SHORT);
        this.props.navigation.goBack();
      }

      const onErr = () => {
        AsyncStorage.setItem("reportToUpdate", JSON.stringify(""));
        ToastAndroid.show("Data Not updated", ToastAndroid.SHORT);
        this.props.navigation.goBack();
      }

      API.updateMatatuDetails(
        this.state.report_id,
        matatuDetailsObj,
        onSuccess,
        onErr,
      );

    } else {
      ToastAndroid.show("Number plate entered is not a valid one", ToastAndroid.SHORT);
    }
      
  }

  render() {

    return (
      <SafeAreaView style={styles.screen}>
        <Caption style={styles.caption}>Fill in the Matatus Number plate</Caption>
        <TextInput 
          value={this.state.numberPlate}
          onChangeText={this._setNumberPlate}
          mode="outlined"
          style={styles.textInput}
          label="Number plate"
          placeholder="KXX 123X"
        />
        <Caption style={styles.caption}>Enter in details such as the Name graffitied on the car, drawings made on it etc.</Caption>
        <TextInput 
          value={this.state.conspicuous}
          onChangeText={this._setConspicuousDetails}
          mode="flat"
          multiline={true}
          style={styles.textInput}
          label="Conspicuous details"
          placeholder="Name graffitied on side, or other weirdly unique features"
        />
        <Caption style={styles.caption}>If you may have got the sacco name wrong, you have a chance to rectify it</Caption>
        <TextInput 
          value={this.state.saccoName}
          onChangeText={this._setSaccoName}
          style={styles.textInput}
          label="Sacco name (optional)"
          placeholder="Enter the sacco name if you feel you got it wrong on first attempt"
        />
        <FAB 
          label="Submit"
          onPress={this._sendNewDetails}
          style={styles.fab}
        />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  caption: {
    marginStart: 16
  },
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 8,
  },
  fab: {
    width: Dimensions.get("window").width - 64,
    alignSelf: "center",
    marginTop: 16,
  },
});
