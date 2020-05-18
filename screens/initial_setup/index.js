import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';

import { List, ProgressBar, Colors, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-community/async-storage';

// screens
import * as Fragments from './fragments';
import Theme from '../../theme';

// app events
import { CONFIG_COMPLETE } from '../../store';

export default class InitialSetup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTabIndex: 0,
      maxTabs: 4
    };

    this.scrollViewContext = React.createRef();
  }

  scrollTo = (index) => {
    let screenWidth = Dimensions.get("window").width;
    let scrollableDistance = 0;

    for(let i=0; i<=index; i++) {
      scrollableDistance += screenWidth;
    }

    this.scrollViewContext.Consumer.scrollTo({x: scrollableDistance, y: 0, animated: true});
  }

  postPreferences = () => {
    let favourites = [];

    DeviceEventEmitter.emit(CONFIG_COMPLETE);
  }

  render() {

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
            <Fragments.TerminalPreferences scrollTo={this.scrollTo.bind(0)} />
          </ScrollView>
          <ProgressBar
            progress={0.51}
            color={Theme.PrimaryColor}
            style={styles.progressBar}
          />
          <View style={styles.scrollControl}>
            <TouchableRipple>
              <Icon name="chevron-left" size={30} style={[styles.controlIcon, styles.scrollLeft]}/>
            </TouchableRipple>
            <TouchableRipple
              onPress={this.postPreferences}
            >
              <Icon name="chevron-right" size={30} style={[styles.controlIcon, styles.scrollRight]}/>
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
  }
});