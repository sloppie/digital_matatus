import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import * as Fragments from './fragments';


export default class Home extends React.Component {

  render() {

    return (
      <SafeAreaView style={styles.screen}>
        <MapView 
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: -1.28123,
            longitude: 36.822596,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          style={styles.map}
        />
        <Fragments.RouteList />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  screen: {
    height: Dimensions.get("window").height
  },
});