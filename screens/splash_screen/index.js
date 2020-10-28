import React from 'react';
import {
  View, StatusBar, SafeAreaView, StyleSheet, NativeModules, Dimensions,
} from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import Theme from '../../theme';
import MockRouteCard from './fragments/MockRouteCard';

import MockSearchBar from './fragments/MockSearchBar';

/**
 * @type {{CONFIGURED: string, PENDING: string, LOADING: string}}
 */
const states = Object.freeze({
  "CONFIGURED": "CONFIGURED",
  "PENDING": "PENDING",
  "LOADING": "LOADING"
});


export default class SplashScreen extends React.PureComponent {

  constructor(props) {
    super(props);

    /**
     * @type {{navigate: boolean}}
     */
    this.state = {
      navigate: false
    };
  }

  componentDidMount() {
    /**@type boolean*/let bool = NativeModules.RenderSynchronizer.switchContentView();

    if(!bool)
      setTimeout(() => {
        console.log("Second try to set screen");
        NativeModules.RenderSynchronizer.switchContentView();
      }, 500); // this indicates that there is a problem in ownership of the UIThread

  }

  componentDidUpdate() {
    /**@type {React.Context<"CONFIGURED" | "PENDING" | "LOADING">} */
    let isConfig = this.context;

    if(isConfig === states.CONFIGURED)
      this.props.navigation.navigate("AppDrawer");
    else if(isConfig === states.PENDING)
      this.props.navigation.navigate("ConfigStack");

  }


  render() {
    
    return (
      <>
        <StatusBar />
        <SafeAreaView style={styles.screen}>
          <MockSearchBar headerHeight={this.props.headerHeight} />
          <View style={{height: "100%", width: Dimensions.get("window").width, justifyContent: "center"}}>
            <ActivityIndicator 
              animating={true}
              size="large"
              color={Theme.PrimaryColor}
              style={{}}
            />
          </View>
          <MockRouteCard />
        </SafeAreaView>
      </>
    );
  }

}



const styles = StyleSheet.create({
  screen: {
    height: "100%",
    // justifyContent: "center",
    backgroundColor: "#f2f2f2",
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
