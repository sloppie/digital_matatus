/* eslint-disable */
import React from 'react';
import { 
  ToastAndroid, 
  Dimensions, 
  DeviceEventEmitter,
  NativeModules, 
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { API } from '../../utilities';

import * as Fragments from './fragments';

import Flag from './fragments/utilities/flag-context';
import discriminationFlags from './fragments/utilities/category-flags';
import { Snackbar } from 'react-native-paper';

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
  discriminationDescriptionRef = React.createRef(); // HD ref
  incidentDescriptionRef = React.createRef(); // incident description ref
  culpritDescriptionRef = React.createRef(); // access to CulpritDescription methods
  privateInformationRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      discriminationCategory: "",
      flags: [
        {
          "Verbal": false,
          "Non-verbal": false,
          "Physical": false,
        }
      ],
      setFlags: {
        "Verbal": [],
        "Non-verbal": [],
        "Physical": [],
      },
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
      snackBarMessage: "",
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

  // this is used to set the discrimination category that the user felt was carried out on them
  _setDiscriminationCategory = (discriminationCategory) => {
    let DC = null;
    if (discriminationCategory === "Sexual Discrimination & Harrasment") {
      DC = discriminationFlags.SD;
    } else if (discriminationCategory == "Discrimination on Physical Disability") {
      DC = discriminationFlags.PD;
    } else {
      DC= discriminationFlags.RD;
    }
    const setFlags = {
      "Verbal": DC.Verbal.map(val => false),
      "Non-verbal": DC["Non-verbal"].map(val => false),
      "Physical": DC.Physical.map(val => false),
    }
    this.setState({
      discriminationCategory,
      setFlags,
    });

    this.forceUpdate();
  }

  _updateCurrentSetFlags = (category, index) => {
    const {setFlags} = this.state;

    setFlags[category][index] = !setFlags[category][index];

    this.setState({setFlags});
    this.forceUpdate();
  }
  
  _getDiscrimiationCategory = () => this.state.discriminationCategory;

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

    const incidentDescription = {
      ...this.discriminationDescriptionRef.current._getInformation(),
      ...this.incidentDescriptionRef.current._getInformation(),
    };

    let response = {
      incidentDescription,
      culpritDescription: this.culpritDescriptionRef.current._getInformation(),
      privateIformation: this.privateInformationRef.current._getInformation(),
      userID: this.state.userID
    };

    console.log(JSON.stringify(response.incidentDescription, null, 2));

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
        title: "Have you pinned your location?",
        description: "Location of the incident may come in very handy while trying to follow up. We advise on pinning of current location. This is a requirement to be able to submit the report",
        priority: true // HIGH
      });

    if(!locationType)
      queries.push({
        title: "Where did the incident happen?",
        description: "We have noticed you have not attached the location type where the incident happened. We advise on selecting location type to help make finding who is culpable a lot easier",
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
        title: "Do you have any videos on to the incident?",
        description: "We have noticed that you do not have any video files attached. We advise attaching of any video evidence if available. This is however not necessary.",
        priority: false // LOW
      });

    if(!photos)
      queries.push({
        title: "Do you have any photos about the incident?",
        description: "We have noticed that you havent attached any photographic evidence related to the incident. We advise attaching of any photo evidence (if available). This is however not necessary",
        priority: false // LOW
      });

    if(!audio)
      queries.push({
        title: "Do you have any audio files about the incident?",
        description: "We have noticed you havent attached any recordings pertaining to the incident. We advise attaching of any audio evidence. This is however not necessary",
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
        title: "Have you input the Sacco?",
        description: "We advise to try and input the sacco name to help follow up on the situation if it happened insiide the bus. If you are not sure about the name, you can input these details later on after you have submitted the report.",
        priority: false // LOW
      });

    if(!culpritTypeIssue)
      queries.push({
        title: "Did you select a perpetrator type?",
        description: "We advice you to select a perpetrator type to help in trying to help find the better decision",
        priority: true // HIGH
      });
    
    if(!routeID)
      queries.push({
        title: "Did you select the route you were using?",
        description: "Please select the route you were using to help with the follow up actions that will be centred around that route.",
        priority: true, // HIGH
      });

    return queries;
  }

  _verifyPI = (privateIformation) => {
    let queries = [];

    console.log("PI == NOT_INPUT" + (privateIformation == "NOT_INPUT"))

    if(privateIformation == "NOT_INPUT")
      queries.push({
        title: "Have you input all your private details?",
        description: "You opted to fill in the private information but didn't fill it in all the details required",
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

  showSnackBar = (snackBarMessage) => {
    this.setState({snackBarMessage, snackBarVisible: true});
  }

  onSnackBarDismiss = () => {
    switch(this.state.action) {
      case "TURN ON LOCATION":
        this._turnOnLocation();
        this.setState({snackBarVisible: false});
        break;
      default:
        this.setState({snackBarVisible: false});
    }
  }

  setSnackBarAction = (action) => {
    this.setState({action});
  }

  _turnOnLocation = () => {
    NativeModules.LocationHandler.turnOnLocationServices()
  }

  render() {

    let lastFlags = this.state.flags[this.state.flags.length - 1];

    return (
      <Flag.Provider value={this.state.setFlags}>
        <>
          <Fragments.TabLayout 
            lastFlags={lastFlags}
            _toggleFlag={this._toggleFlag}
            setDiscriminationCategory={this._setDiscriminationCategory}
            getDiscriminationCategory={this._getDiscrimiationCategory}
            updateCurrentSetFlags={this._updateCurrentSetFlags}
            secondaryNavigation={this.props.navigation}
            discriminationDescriptionRef={this.discriminationDescriptionRef}
            incidentDescriptionRef={this.incidentDescriptionRef}
            culpritDescriptionRef={this.culpritDescriptionRef}
            privateInformationRef={this.privateInformationRef}
            _getInformation={this._getInformation}
            _sendVerifiedData={this._sendVerifiedData}
            showSnackBar={this.showSnackBar}
            setSnackBarAction={this.setSnackBarAction}
          />
          <Snackbar
            visible={this.state.snackBarVisible}
            action={{
              label: this.state.action,
              onPress: this.onSnackBarDismiss,
            }}
            onDismiss={() => this.setState({snackBarVisible: false})} >
            {this.state.snackBarMessage}
          </Snackbar>
        </>
      </Flag.Provider>
    );
  }

}
