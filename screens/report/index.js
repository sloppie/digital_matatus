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
      queries: null,
      verified: false, // help prevent rendering verify screen before its verified
      response: null, // this is the data to be send to the server
    };

    this.actions = [
      {icon: "file", label:"Send Publicly", onPress: this._publicSend},
      {icon: "incognito", label: "Send Private", onPress: this._anonymousSend},
    ];

    this.FULL_SCREEN_HEIGHT = Dimensions.get("window").height;

    // REFS CREATED
    this.parentScrollViewRef =React.createRef(); // Parent ScrollView Ref
    this.incidentDescriptionRef = React.createRef(); // incident description ref
    this.culpritDescriptionRef = React.createRef(); // access to CulpritDescription methods
    this.privateIformationRef = React.createRef();
  }

  _scrollTo = (tabName) => {
    let index;
    let x = 0;
    let y = 0;
    switch (tabName) {
      case "IncidentDescription":
        index = 0;
        break;
      case "CulpritDescription":
        index = 1;
        break;
      case "privateInformation":
        index = 2;
        break;
      default:
        index = 0;
        break;
    }

    for(let i=0; i<x; i++) {
      x += Dimensions.get("window").width; 
    }

    this.parentScrollViewRef.current.scrollTo({x, y, animated: true});

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

  _getInformation = () => {
    let response = {
      incidentDescription: this.incidentDescriptionRef.current._getInformation(),
      culpritDescription: this.culpritDescriptionRef.current._getInformation(),
      privateIformation: this.privateIformationRef.current._getInformation(),
    };

    // verify data
    let incidentDescriptionQueries = this._verifyID({...response.incidentDescription});
    let culpritDescriptionQueries = this._verifyCD({...response.culpritDescription});
    let privateIformationQueries = this._verifyPI({...response.privateIformation});
    
    let queries;

    let has_query =  (incidentDescriptionQueries.length > 0 || culpritDescriptionQueries.length > 0 || privateIformationQueries.length > 0)

    if(!has_query) {
      this.setState({queries: {}, verified: true, response});
    } else {
      queries = {};
      queries.incidentDescriptionQueries = incidentDescriptionQueries;
      queries.culpritDescriptionQueries = culpritDescriptionQueries;
      queries.privateInformationQueries = privateIformationQueries;
      this.setState({queries, verified: true, response});
    }

  }

  _verifyID = (incidentDescription) => {
    let queries = [];

    let videos = incidentDescription.attachedVideos.length != 0; // check for attached videos
    let photos = incidentDescription.attachedPhotos.length != 0; // check for attached videos
    let audio = incidentDescription.attachedAudios.length != 0; // check for attached audio

    let location = incidentDescription.location !== null;
    let locationType;

    let harassmentFlags = Object.keys(incidentDescription.flags).length !== 0;
    
    if(harassmentFlags) {
      let currentFlag = false;

      for(let flag in incidentDescription.flags) {
        currentFlag =  incidentDescription.flags[flag].length !== 0;

        if(currentFlag) {
          break;
        }

      }

      harassmentFlags = currentFlag;
    }

    if(location)
      locationType = (typeof location.type == "string")? location.type !== "": false; 

    if(!videos)
      queries.push({
        title: "No video files attached",
        description: "We advise attaching of any video evidence if available",
        priority: false // LOW
      });

    if(!photos)
      queries.push({
        title: "No photos attached",
        description: "We advise attaching of any photo evidence if available",
        priority: false // LOW
      });

    if(!audio)
      queries.push({
        title: "no audio files attached",
        description: "we advise attaching of any audio evidence if available",
        priority: false // LOW
      });

    if(!location)
      queries.push({
        title: "no location attached",
        description: "we advise on pinning of current location if available",
        priority: false // LOW
      });

    if(!locationType)
      queries.push({
        title: "no location type selected",
        description: "we advise on selecting location type to help find who is culpable a lot easier",
        priority: false // LOW
      });

    if(!harassmentFlags)
      queries.push({
        title: "No harassment flag set",
        description: "Please select flags that desribe the incident",
        priority: true // HIGH
      });
    
    return queries;
  }

  _verifyCD = (culpritDescription) => {
    let queries = [];
    let nameIssue = culpritDescription.saccoName == "ALL" || culpritDescription != "";
    let culpritTypeIssue = culpritDescription.culpritType !== "";
    let routeID = culpritDescription.routeID !== "";

    if(!nameIssue)
      queries.push({
        title: "Sacco Name not defined",
        description: "We advise to try and input the sacco name to help follow up on the situation if it happened insiide the bus",
        priority: false // LOW
      });

    if(culpritTypeIssue)
      queries.push({
        title: "Perpetrator type empty",
        description: "We advice you to select a perpetrator type to help in trying to help find the better decision",
        priority: true // HIGH
      });
    
    if(!routeID)
      queries.push({
        title: "Route not selected",
        description: "Please select a route to help with the follow up actions",
        priority: true, // HIGH
      });

    return queries;
  }

  _verifyPI = (privateIformation) => {
    let queries = [];

    if(privateIformation == "NOT_INPUT")
      queries.push({
        title: "Private info not input",
        description: "You opted to fill in the private information but didn't fill it in",
        priority: true, // HIGH
      });

    return queries;
  }

  // unverify data
  _unverifyData = () => this.setState({verified: false, response: null});

  // send verified data
  _sendVerifiedData = () => {
    console.log(`data to be sent: ${JSON.stringify(this.state.response, null, 2)}`)
  }

  render() {
    // ALWAYS USE THE SPREAD OPERATOR, OBJECTS ARE ALWAYS PASSED BY REFERNCE AND THIS MAY LEAD
    // TO DIFFERENCE OF VALUES ACROSS THE APPLICATION!!!!!!
    let lastFlags = {...this.state.flags[this.state.flags.length - 1]};

    return (
      <ScrollView 
        ref={this.parentScrollViewRef}
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
            ref={this.privateIformationRef}
            setPrivateInormation={this._setPrivateInformation}
          />
          <FAB
            visible={this.state.fabGroupVisible}
            icon="file-send"
            label="Send Information"
            style={styles.fabGroup}
            onPress={this._getInformation}
          />
        </View>
        {
          (this.state.verified)
          ? <Fragments.DataVerification 
            verifyData={this._sendVerifiedData}
            unverifyData={this._unverifyData}
            _scrollTo={this._scrollTo}
            queries={this.state.queries} 
          />
          : null
        }
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  page: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  fabGroup: {
    marginTop: 16,
    marginBottom: 16,
    alignSelf: "center",
    width: (Dimensions.get("window").width - 32),
    bottom: 0,
  },
});