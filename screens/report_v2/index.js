import React from 'react';
import { 
  ToastAndroid, 
  Dimensions, 
  DeviceEventEmitter, 
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { API } from '../../utilities';

import * as Fragments from './fragments';

let REPORT_NAVIGATION_REF = null;

export default class Report extends React.PureComponent {

  snackBarMessage = "";
  actions = [
    {icon: "file", label:"Send Publicly", onPress: this._publicSend},
    {icon: "incognito", label: "Send Private", onPress: this._anonymousSend},
  ];

  FULL_SCREEN_HEIGHT = Dimensions.get("window").height;

  // REFS CREATED
  parentScrollViewRef =React.createRef(); // Parent ScrollView Ref
  incidentDescriptionRef = React.createRef(); // incident description ref
  culpritDescriptionRef = React.createRef(); // access to CulpritDescription methods
  privateInformationRef = React.createRef();

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
      userID: "",
      posting: false,
      verifying: false,
      snackBarVisible: false,
    };

  }

  async componentDidMount() {
    // set the UserID that is to be attached to the information
    this.launchCameraSubscription = DeviceEventEmitter.addListener("LAUNCH_CAMERA", this._getCameraType);
    let userID = await AsyncStorage.getItem("userID", (err) => console.log(err));
    this.setState({userID});
  }

  _getCameraType = (type) => {
    this._launchCamera(type);
  }

  _launchCamera = (type) => { 
    this.props.navigation.navigate("Camera", {
      source: "Report", // helps know which screen the camera has been launched from.
      type // helps know whether to launch the video or photo camera.
    });
  }

  componentWillUnmount() {
    this.launchCameraSubscription.remove();
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
      case "PrivateInformation":
        index = 2;
        break;
      case "DataVerification":
        index = 3;
        break;
      default:
        index = 0;
        break;
    }

    for(let i=0; i<index; i++) {
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

    this.setState({verifying: true});
    let response = {
      incidentDescription: this.incidentDescriptionRef.current._getInformation(),
      culpritDescription: this.culpritDescriptionRef.current._getInformation(),
      privateIformation: this.privateInformationRef.current._getInformation(),
      userID: this.state.userID
    };

    // verify data
    let incidentDescriptionQueries = this._verifyID({...response.incidentDescription});
    let culpritDescriptionQueries = this._verifyCD({...response.culpritDescription});
    let privateIformationQueries = this._verifyPI(response.privateIformation);
    
    // incase there are no queries
    let queries = {};

    let has_query =  (
        incidentDescriptionQueries.length > 0 || 
        culpritDescriptionQueries.length > 0 || 
        privateIformationQueries.length > 0);

    if(!has_query) {
      this.setState({queries, verified: true, response});
    } else {
      queries = {};
      queries.incidentDescriptionQueries = incidentDescriptionQueries;
      queries.culpritDescriptionQueries = culpritDescriptionQueries;
      queries.privateInformationQueries = privateIformationQueries;
      this.setState({queries, verified: true, response, verifying: false});
    }

    // setTimeout(() => this._scrollTo("DataVerification"), 100);

    // bool used by the PrivateInformation BottomSheet to determine whether to activate the Submit button
    return {has_query, queries}; 
  }

  _verifyID = (incidentDescription) => {
    let queries = [];

    let videos = incidentDescription.attachedVideosData.length != 0; // check for attached videos
    let photos = incidentDescription.attachedPhotosData.length != 0; // check for attached videos
    let audio = incidentDescription.attachedAudiosData.length != 0; // check for attached audio

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
      locationType = (typeof incidentDescription.location.type == "string")? incidentDescription.location.type !== "": false; 

    if(!location)
      queries.push({
        title: "no location attached",
        description: "we advise on pinning of current location if available",
        priority: true // HIGH
      });

    if(!locationType)
      queries.push({
        title: "no location type selected",
        description: "we advise on selecting location type to help find who is culpable a lot easier",
        priority: true // LOW
      });

    if(!harassmentFlags)
      queries.push({
        title: "No harassment flag set",
        description: "Please select flags that desribe the incident",
        priority: true // HIGH
      });
    

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

    return queries;
  }

  _verifyCD = (culpritDescription) => {
    let queries = [];
    let nameIssue = culpritDescription.saccoName == "ALL" || culpritDescription != "";
    let culpritTypeIssue = culpritDescription.culpritType !== "";
    let routeID = culpritDescription.routeID !== "" && culpritDescription.routeID !== undefined;

    if(!nameIssue)
      queries.push({
        title: "Sacco Name not defined",
        description: "We advise to try and input the sacco name to help follow up on the situation if it happened insiide the bus",
        priority: false // LOW
      });

    if(!culpritTypeIssue)
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

    console.log("PI == NOT_INPUT" + (privateIformation == "NOT_INPUT"))

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
    
    if(!REPORT_NAVIGATION_REF)
      REPORT_NAVIGATION_REF = require('../../routes/AppDrawer').REPORT_NAVIGATION_REF;
    
    const onSuccess = (payload) => {
      
      if(this.state.response.incidentDescription.location.type == "INSIDE_BUS") {
        AsyncStorage.setItem("reportToUpdate", JSON.stringify(payload.report_id));
        this.props.navigation.navigate("SetReminder");
      } else {
        REPORT_NAVIGATION_REF.navigate("Home");
      }

    }

    const onErr = () => {
      this.snackBarMessage = "Report will be sent once internet conection is back"
      this.setState({snackBarVisible: true});

      if(this.state.response.incidentDescription.location.type == "INSIDE_BUS") {
        AsyncStorage.multiSet(
          [
            ["reportToUpdate", JSON.stringify("FETCH_REPORT_ID")],
            ["savedReport", JSON.stringify(this.state.response)]
          ],
        );
      } else {
        AsyncStorage.setItem("savedReport", JSON.stringify(this.state.response));
      }

      REPORT_NAVIGATION_REF.navigate("Home");
    } 

    API.fileReport(this.state.response, onSuccess, onErr);
  }

  render() {

    let lastFlags = this.state.flags[this.state.flags.length - 1];

    return (
      <Fragments.TabLayout 
        lastFlags={lastFlags}
        _toggleFlag={this._toggleFlag}
        secondaryNavigation={this.props.navigation}
        incidentDescriptionRef={this.incidentDescriptionRef}
        culpritDescriptionRef={this.culpritDescriptionRef}
        privateInformationRef={this.privateInformationRef}
        _getInformation={this._getInformation}
        _sendVerifiedData={this._sendVerifiedData}
      />
    );
  }

}
