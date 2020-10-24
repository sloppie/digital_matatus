import React from 'react';
import {
  StatusBar,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  NativeModules,
  ToastAndroid
} from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import Theme from '../../theme';

export default class SplashScreen extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      navigate: false
    };
  }
  
  componentDidMount() {
    console.log("SplashScreen Mounted");
    let bool = NativeModules.RenderSynchronizer.switchContentView();

    if(!bool)
      setTimeout(() => {
        NativeModules.RenderSynchronizer.switchContentView();
      }, 500); // this indicates that there is a problem in ownership of the UIThread

    // ToastAndroid.show("SplashScreen rendered", ToastAndroid.SHORT);
  }


  render() {
    
    return (
      <>
        <StatusBar />
        <SafeAreaView style={styles.screen}>
          {/* <View style={styles.brandContainer}>
            <Text>
              <Text style={[styles.brandText, styles.brandTextLight]}>digital </Text>
              <Text style={[styles.brandText, styles.brandTextBold]}>matatus</Text>
            </Text>
          </View> */}
          <ActivityIndicator 
            animating={true}
            size="large"
            color={Theme.PrimaryColor}
          />
        </SafeAreaView>
      </>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    justifyContent: "center",
    // backgroundColor: Theme.PrimaryColor,
    alignItems: "center",
  },
  brandContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  brandText: {
    color: "white",
    fontSize: 48,
  },
  brandTextLight: {
    fontFamily: Theme.OpenSans,
  },
  brandTextBold: {
    fontFamily: Theme.OpenSansBold,
  },
});