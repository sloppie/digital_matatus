import React from 'react';
import {
  StatusBar, SafeAreaView, StyleSheet, NativeModules,
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
    let bool = NativeModules.RenderSynchronizer.switchContentView();

    if(!bool)
      setTimeout(() => {
        console.log("Second try to set screen");
        NativeModules.RenderSynchronizer.switchContentView();
      }, 500); // this indicates that there is a problem in ownership of the UIThread

  }

  componentDidUpdate() {
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
          {/* <Configured.Consumer>
            {value => (
              <LoadingIndicator 
                navigation={this.props.navigation}
                isConfig={value}
              />
              
            )}
          </Configured.Consumer> */}
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
