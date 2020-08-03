import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';

import { List, ProgressBar, Colors, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// screens
import * as Fragments from './fragments';
// theme
import Theme from '../../theme';
// utilities
import { PermissionRequest } from '../../utilities';

// app events
import { CONFIG_COMPLETE } from '../../store';
import AsyncStorage from '@react-native-community/async-storage';

export default class InitialSetup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTabIndex: 0,
      maxTabs: (this.props.route.params.skipSignUp)? 4: 5,
      nextActive: true,
      backActive: false,
      firstToggle: false,
      permissions: null
    };

    this.scrollViewContext = React.createRef();
    this.preferencesRef = React.createRef();
  }

  scrollTo = (index) => {
    let res = true;

    console.log("Active tab index: " + (index + 1));

    // This is the scroll indexes
    // 0 - TerminalPreferences Explanation
    // 1 - TerminalPreferences screen
    // 2 - Permissions explanation & screen
    // 3 - SignUpScreen
    // 4 - loadingScreen

    switch(index) {
      case 1:
        res = this.preferencesRef.current.postFavourites(); // call the postReferences func in TerminalPreferences
      case 2:
        this.checkPermissions();
        break;
      case 3:
        break;
    }

    if(!res)
      return;

    let screenWidth = Dimensions.get("window").width;
    let scrollableDistance = 0;

    for(let i=0; i<(index + 1); i++) {
      scrollableDistance += screenWidth;
    }

    this.scrollViewContext.current.scrollTo({x: scrollableDistance, y: 0, animated: true});

    
    if(index + 1 == this.state.maxTabs) {
      this.setState({
        activeTabIndex: index,
        nextActive: false,
        backActive: true
      });
    } else
      this.setState({
        activeTabIndex: index + 1,
        nextActive: ((index + 1) == 1 && !this.state.firstToggle)? false: true,
        backActive: true
      });

    if(this.props.route.params.skipSignUp && index + 1 == 3) {
      console.log("Finalising...");
      this.finalise();
    }

  }

  scrollLeft = (index) => {
    let screenWidth = Dimensions.get("window").width;
    let scrollableDistance = 0;

    for(let i=0; i<(index - 1); i++) {
      scrollableDistance += screenWidth;
    }

    this.scrollViewContext.current.scrollTo({x: scrollableDistance, y: 0, animated: true});
    
    if(index)
      this.setState({
        activeTabIndex: index - 1,
        backActive: (index - 1)? true: false,
        nextActive: true
      });
    else
      this.setState({
        activeTabIndex: 0,
        backActive: false,
      });
  }

  activateNext() {
    this.setState({
      nextActive: true,
      firstToggle: true
    });
  }
  
  deactivateNext() {
    this.setState({
      nextActive: false,
      firstToggle: false
    });
  }

  checkPermissions = async () => {

    if(!this.state.permissions) {
      let response = await PermissionRequest.requestAllPermissions();
  
      this.setState({
        permissions: response
      });
    }

  }

  /**
   * @param {String} email this will be passed in by the Fragments.SignUpScreen
   */
  finalise = async (email) => {
    if(this.props.route.params.skipSignUp) {
      console.log("Skipping sign up");
      let favourites = [...this.preferencesRef.current.packFavourites()];

      AsyncStorage.multiSet(
        [
          ["favouriteRoutes", JSON.stringify(favourites)],
          ["isConfig", JSON.stringify(true)],
          ["userID", "anonymous@digitalmatatus.com"] // stores user's Hash
        ], 
        (err) => {
        
          if(err) {
            ToastAndroid.show("Error storing data...", ToastAndroid.SHORT);
          }
      });

      console.log("Emitting config complete");
      true && DeviceEventEmitter.emit(CONFIG_COMPLETE);

    } else {
      this.scrollTo(4);
  
      let favourites = [...this.preferencesRef.current.packFavourites()];
      let deviceToken = await AsyncStorage.getItem("deviceNotificationToken")
  
      if(!deviceToken) {
        let NotificationSetup = require('../../utilities/push-notifications').default;
        NotificationSetup.configure();
        deviceToken = await AsyncStorage.getItem("deviceNotificationToken")
      }
  
      fetch("http://41.89.64.18:3000/api/user/new", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          favouriteRoutes: favourites.map(route => route.route_id), // map route_ids
          deviceToken: JSON.parse(deviceToken)
        })
      }).then(data => data.json()).then(response => {
        console.log(response)
        let state = response;
  
        AsyncStorage.multiSet(
          [
            ["favouriteRoutes", JSON.stringify(favourites)],
            [
              "appPermissionsResult", 
              JSON.stringify({ // values
                "LOCATION": this.state.permissions[0],
                "CAMERA": this.state.permissions[1],
                "AUDIO": this.state.permissions[2]
              }),
            ],
            ["isConfig", JSON.stringify(true)],
            ["userID", response._id] // stores user's Hash
          ], 
          (err) => {
          
            if(err) {
              ToastAndroid.show("Error storing data...", ToastAndroid.SHORT);
            }
        });
  
        if(state) { // if set online, set locally also
          DeviceEventEmitter.emit(CONFIG_COMPLETE);
        } else {
          ToastAndroid.show("Error adding user you may already have an account", ToastAndroid.SHORT);
        }
  
      }).catch(err => {
        console.log(err)
      });
    }


  }
  
  render() {
    // "\u27A1", - right arrow emoji
    
    return (
      <SafeAreaView style={styles.screen}>
        <ImageBackground 
          style={styles.imageBackground}
          source={require("../../assets/images/nairobi-transit.jpg")}>
          <ScrollView
            ref={this.scrollViewContext} 
            horizontal={true}
            scrollEnabled={false}
            style={styles.scrollView}
          >
            <Fragments.ExplanationScreen 
              text={[
                "Tell us about", 
                "common routes", 
                "you use.", 
                "Search for the route,", 
                "and give a \u2764.", 
                "Press the > arrow",
                "to begin.",
              ]}
            />
            <Fragments.TerminalPreferences 
              ref={this.preferencesRef}
              activateNext={this.activateNext.bind(this)}
              deactivateNext={this.deactivateNext.bind(this)}
            />
            <Fragments.ExplanationScreen 
              text={[
                "This app needs",
                "you to grant it" ,
                "a few permissions for you",
                "to enjoy our services",
                "fully :)"
              ]}
            />
            {!this.props.route.params.skipSignUp && (
                <Fragments.SignUpScreen _finalise={this.finalise} />
            )}
            <Fragments.LoadingScreen 
              skipSignUp={this.props.route.params.skipSignUp}
              finalise={this.finalise}
            /> 
          </ScrollView>
          <ProgressBar
            progress={(this.state.activeTabIndex + 1) / this.state.maxTabs}
            color={Theme.PrimaryColor}
            style={styles.progressBar}
          />
          <View style={styles.scrollControl}>
            <TouchableRipple
              onPress={this.scrollLeft.bind(this, this.state.activeTabIndex)}
            >
              <Icon 
                name="chevron-left" 
                size={30} 
                style={[
                  styles.controlIcon, 
                  styles.scrollLeft,
                  (this.state.backActive)? styles.activeIcon: styles.inactiveIcon
                ]}/>
            </TouchableRipple>
            <TouchableRipple
              onPress={this.scrollTo.bind(this, this.state.activeTabIndex)}
            >
              {
                this.state.activeTabIndex != this.state.maxTabs - 1?
                  <Icon 
                    name="chevron-right" 
                    size={30} 
                    style={[
                      styles.controlIcon, 
                      styles.scrollRight, 
                      (this.state.nextActive)? styles.activeIcon: styles.inactiveIcon]}
                  />
                :
                    <Icon 
                      name="chevron-right" 
                      size={30} 
                      style={[
                        styles.controlIcon, 
                        styles.scrollRight,
                        styles.inactiveIcon
                      ]} />

              }
            </TouchableRipple>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  imageBackground: {
    flex: 1,
    alignSelf: "stretch",
    width: null
  },
  scrollView: {
    width: Dimensions.get("window").width,
  },
  scrollControl: {
    position: "relative",
    bottom: 0,
    start: 0,
    flexDirection: "row",
    width: Dimensions.get("window").width,
    justifyContent: "space-between"
  },
  titleStyle: {
    fontFamily: Theme.OpenSansBold,
    textAlign: "center"
  },
  controlIcon: {
    marginVertical: 8,
  },
  scrollLeft: {
    marginRight: 16,
  },
  progressBar: {
    backgroundColor: Colors.red500
  },
  scrollRight: {
    textAlign: "right",
    marginRight: 16,
  },
  activeIcon: {
    color: "#000"
  },
  inactiveIcon: {
    color: "#f3f3f3"
  },
  done: {
    backgroundColor: Colors.green400,
    flexDirection: "row",
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  doneIcon: {
    color: Colors.white, 
    marginEnd: 2
  },
  doneText: {
    color: Colors.white,
    textAlignVertical: "center",
    fontSize: 30,
    fontFamily: Theme.OpenSansBold,
    marginEnd: 16
  },
});