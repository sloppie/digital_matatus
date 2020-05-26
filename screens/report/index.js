import React from 'react';
import { ScrollView, StyleSheet, ToastAndroid, Dimensions, View } from 'react-native';
import { FAB, Divider } from 'react-native-paper';

import * as Fragments from './fragments';

/**
 * @todo use refs to fetch information from children
 */
export default class Report extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      flags: [
        {
          "Verbal": false,
          "Non-verbal": false,
          "Physical": false,
        }
      ],
      fabGroupVisible: true, // this is used to toggle visiblity when the TextInputs are active
      culpritDescription: {},
      incedentDescription: {},
    };

    this.actions = [
      {icon: "file", label:"Send Publicly", onPress: this._publicSend},
      {icon: "incognito", label: "Send Private", onPress: this._anonymousSend},
    ];

    this.FULL_SCREEN_HEIGHT = Dimensions.get("window").height;
    this.incidentDescriptionRef = React.createRef(); // incident description ref
    this.culpritDescriptionRef = React.createRef(); // access to CulpritDescription methods
  }

  // CATEGORIES
  _toggleFlag = (flagName) => {
    let flags = [...this.state.flags];
    let fl = flags.length; // fl flagLength
    let newFlag = {...flags[fl-1]} // last flags object
    newFlag[flagName] = !(newFlag[flagName]);
    flags.push(newFlag);

    this.setState({flags}); // the most recent flag is located as the last member of the array
    // the section below toggle the flag values of the Child Component Fragments.IncidentDescription
    this.incidentDescriptionRef.current._turnFlag(flagName, newFlag[flagName]);
  }

  // INCEDENT DESCRIPTION DETAILS
  _setDescription = (incedentDescrition) => {
    console.log(incedentDescrition);
  }

  // culprit description details
  _setCulpritDescription = (culpritDescription) => {
    console.log(culpritDescription);
  }

  // setPrivateInformation
  _setPrivateInformation = () => {
    console.log(privateIformation);
  }

  _anonymousSend = () => {
    console.log("Anonymous send initiated")
  }

  _publicSend = () => {
    console.log("User wanted to send publicly");
  }

  _stateChange = ({open}) => this.setState({open})

  _initiateSend = () => {
    if(!this.state.open)
      ToastAndroid.show("You are about to send sensitive info", ToastAndroid.SHORT);
  }

  // Toggle TextInput Visibility
  _toggleFABVisibility = () => this.setState({fabGroupVisible: !this.state.fabGroupVisible});

  _handleLayoutChange = ({nativeEvent}) => (nativeEvent.layout.height < (0.8 * this.FULL_SCREEN_HEIGHT))
      ? this.setState({fabGroupVisible: false}) // dont display FABGroup if display size is less than 80%
      : this.setState({fabGroupVisible: true});

  _getData = () => {

  }

  render() {
    // ALWAYS USE THE SPREAD OPERATOR, OBJECTS ARE ALWAYS PASSED BY REFERNCE AND THIS MAY LEAD
    // TO DIFFERENCE OF VALUES ACROSS THE APPLICATION!!!!!!
    let lastFlags = {...this.state.flags[this.state.flags.length - 1]};

    return (
      <ScrollView 
        style={styles.screen}
        onLayout={this._handleLayoutChange}
        horizontal={true}
        pagingEnabled={true}
        nestedScrollEnabled={true}
      >
        <View style={styles.page}>
          <Fragments.Chips
            flags={lastFlags}
            toggleFlag={this._toggleFlag}
            navigation={this.props.navigation}
          />
          <Divider />
          <Fragments.IncedentDescription 
            ref={this.incidentDescriptionRef}
            setDescription={this._setDescription}
            culpritDescriptionRef={this.culpritDescriptionRef}
          />
        </View>
        <Fragments.CulpritDescription 
          ref={this.culpritDescriptionRef}
          setCulpritDescription={this._setCulpritDescription}
        />
        <View style={styles.page}>
          <Fragments.PrivateInformation 
            setPrivateInormation={this._setPrivateInformation}
          />
          <FAB
            visible={this.state.fabGroupVisible}
            icon="file-send"
            label="Send Information"
            style={styles.fabGroup}
          />
        </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  page: {
    width: Dimensions.get("window").width
  },
  fabGroup: {
    marginTop: 16,
    marginBottom: 16,
    alignSelf: "center",
    width: (Dimensions.get("window").width - 32),
  },
});
