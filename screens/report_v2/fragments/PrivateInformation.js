import React from 'react';
import { View, Dimensions, StyleSheet, ToastAndroid } from 'react-native';
import { Switch, Card, Colors, Caption, FAB, Title, Headline, Surface, Button } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

let TextInput = null;

export default class PrivateInformation extends React.PureComponent {

  bottomSheetRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      collapse: true, // if it is collapsed , then it means the user doesnt want to share private information
      firstName: "",
      lastName: "",
      email: "",
      submitDisabled: true,
      activeSnap: 0, // this will be used with the mechanical snapping of the BottomSheet
    };

  }

  // used to control visibility of the private info TextInputs
  _togglePrivateInformation = () => this.setState({collapse: !this.state.collapse});

  // SETTERS for the TextInputs
  _handleFirstName = (firstName) => this.setState({firstName});

  _handleLastName = (lastName) => this.setState({lastName});

  _handleEmail = (email) => this.setState({email});

  // renders the text inputs of the visibility is allowed for
  _renderTextInputs = () => {
    let textInputs = [];

    if(!TextInput)
      TextInput = require("react-native-paper").TextInput;
    
    // First Name
    textInputs.push(
      <TextInput
        value={this.state.firstName}
        style={styles.textInput}
        placeholder="First name"
        onChangeText={this._handleFirstName}
        mode="outlined"
        label="First Name"
        key="1"
      />
    );

    // Last Name
    textInputs.push(
      <TextInput
        value={this.state.lastName}
        style={styles.textInput}
        placeholder="Last name"
        onChangeText={this._handleLastName}
        mode="outlined"
        label="Last Name"
        key="2"
      />
    );

    // email
    textInputs.push(
      <TextInput
        value={this.state.email}
        style={styles.textInput}
        placeholder="email@example.com"
        onChangeText={this._handleEmail}
        mode="outlined"
        label="email"
        keyboardType="email-address"
        key="3"
      />
    );

    return textInputs;
  }

  _MBSheetOpenEnd = () => {
    this.setState({activeSnap: 2});
  }

  _MBSheetOpenStart = () => {
    this.setState({activeSnap: 1});
  }

  _BSLayout = ({nativeEvent}) => {
    console.log(nativeEvent)
  }

  _renderHeader = () => (
    <View style={styles.bottomSheetHeader}>
      <Icon name="drag-horizontal" size={30} />
    </View>
  );

  _renderContent = () => (
    <View 
      style={(this.state.activeSnap < 2)? styles.bottomSheetContent: styles.bottomSheetContentFull}
    >
      <Headline style={styles.bottomSheetTitle}>Pending Issues</Headline>
      <FAB 
        icon="file-send"
        label="Submit Report"
        disabled={this.state.submitDisabled} 
        style={styles.submitButton}
      />
    </View>
  );

  _getInformation = () => {
    
    if(this.state.collapse) {
      return null; // returns null if there is no private information to be returned
    } else {
      let isEmpty = this.state.email == "" || this.state.firstName == "" || this.state.lastName == "";
      
      if(isEmpty) {
        return "NOT_INPUT"; // flag used to communicate state
      } else {
        let {email, firstName, lastName} = this.state;

        return {email, firstName, lastName}; // return user information
      }

    }

  }

  _verifyInformation = () => {
    let submitDisabled = this.props._getInformation();
    console.log("Submit disabled: " + submitDisabled);
    this.setState({submitDisabled});
    this.bottomSheetRef.current.snapTo(1);
  }

  render() {

    return (
      <>
        <View style={styles.container}>
          <Card.Title 
            title="Private Information"
            titleStyle={(this.state.collapse)? styles.disabledTitle: styles.activeTitle}
            subtitle="This is turned off by default to mantain anonimity"
            right={props => <Switch {...props} value={!this.state.collapse} onValueChange={this._togglePrivateInformation}/>}
          />
          {(this.state.collapse)? null: this._renderTextInputs()}
          {
            (this.state.collapse)
            ? <View style={styles.incognitoContainer}>
                <Icon name="incognito" style={styles.incognitoIcon} size={100} />
                <Caption style={styles.incognitoCaption}>
                  Your information will not be shared in the report filed
                </Caption>
                <Caption style={styles.incognitoCaption}>
                  To share your information, please turn on the switch at the top
                </Caption>
              </View>
            : null 
          }
        </View>
        <Button 
          icon="file-send"
          label="Verify Information"
          onPress={this._verifyInformation}
          style={styles.fab}
        >
          Verify Information
        </Button>
        <BottomSheet 
          ref={this.bottomSheetRef}
          snapPoints={[0, "50%", "90%"]}
          initialSnap={0}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          style={styles.bottomSheet}
          onLayout={this._BSLayout}
          onOpenEnd={this._MBSheetOpenEnd}
          onOpenStart={this._MBSheetOpenStart}
        />
      </>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    minHeight: "50%"
  },
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 8,
  },
  disabledTitle: {
    color: "#999",
  },
  activeTitle: {
    color: "#444",
  },
  incognitoContainer: {
    width: Dimensions.get("window").width,
    alignSelf: "stretch",
    alignContent: "center",
    justifyContent: "center"
  },
  incognitoIcon: {
    textAlignVertical: "center",
    textAlign: "center",
    padding: 16,
  },
  incognitoCaption: {
    textAlign: "center",
  },
  fab: {
    elevation: 0,
    zIndex: 0
  },
  bottomSheet: {
    // position: "absolute",
    // bottom: 0,
    elevation: 3,
    zIndex: 3,
    backgroundColor: "white",
    width: Dimensions.get("window").width,
    alignSelf: "stretch",
    flex: 1,
    height: Dimensions.get("window").height
  },
  bottomSheetHeader: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  bottomSheetContent: {
    backgroundColor: "white",
    alignSelf: "stretch",
    height: (Dimensions.get("window").height * 0.5)
  },
  // for the full bottom sheet (screen 90%)
  bottomSheetContentFull: {
    backgroundColor: "purple",
    alignSelf: "stretch",
    height: Dimensions.get("window").height
  },
  bottomSheetTitle: {
    textAlign: "center",
  },
  submitButton: {
    alignSelf: "center",
    width: Dimensions.get("window").width - 64,
  },
});
