import React from 'react';
import {
  SafeAreaView,
  ToastAndroid,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Searchbar, Surface, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE, Marker, OverlayComponent } from 'react-native-maps';

import * as Fragments from './fragments';
import Theme from '../../theme';
import { HOME_NAVIGATION_REF } from '../../routes/AppDrawer';

const SHAPES = require("../../GTFS_FEED/shapes/shape.json");


export default class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchBar: "",
      markers: [],
      region: {
        latitude: -1.28123,
        longitude: 36.822596,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }
    };
  }

  _openDrawer = () => HOME_NAVIGATION_REF.openDrawer();

  _handleTextChange = (text) => {

    this.setState({
      searchBar: text
    });

  }

  setBusTerminalMarker = (tripObj) => {
    let from;
    let to;

    from = SHAPES[tripObj.from.shape_id][0];
    to = SHAPES[tripObj.to.shape_id][0];

    let markers = [
      {
        name: tripObj.from.trip_headsign,
        coordinate: {
          latitude: Number(from.shape_pt_lat),
          longitude: Number(from.shape_pt_lon)
        },
      },
      {
        name: tripObj.to.trip_headsign,
        coordinate: {
          latitude: Number(to.shape_pt_lat),
          longitude: Number(to.shape_pt_lon)
        }
      },
    ];

    let region = {...this.state.region};
    region.latitude = markers[0].coordinate.latitude;
    region.longitude = markers[0].coordinate.longitude;

    this.setState({
      markers,
      region
    });
  }

  generateBusTerminalMarker = () => {
    let markers = [];

    this.state.markers.forEach(marker => markers.push(
      <Marker 
        key={marker.name}
        coordinate={marker.coordinate}
        title={`${marker.name} terminal pick-up`}
        description={`${marker.name} terminal pick-up`}
      />
    ));

    return markers;
  }  

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
          region={this.state.region}
          style={styles.map}
        >
          {this.generateBusTerminalMarker()}
        </MapView>  
          <Searchbar
            style={styles.searchBar}
            placeholder="Search for route"
            onChangeText={this._handleTextChange}
            icon="menu"
            onIconPress={this._openDrawer}
          />
        <Fragments.RouteList 
          setBusTerminalMarker={this.setBusTerminalMarker}
          navigation={this.props.navigation}
        />
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
  appBar: {
    flexDirection: "row",
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    maxHeight: 55,
    position: "absolute",
    top: 8,
    start: 8,
    elevation: 1,
    backgroundColor: "white",
  },
  searchBar: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    position: "absolute",
    top: 8
  },
  iconContainer: {
    padding: 8, 
  },
  icon: {
    textAlignVertical: "center",
  },
});