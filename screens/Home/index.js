import React from 'react';
import {
  SafeAreaView,
  ToastAndroid,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import * as Fragments from './fragments';
import Theme from '../../theme';

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
        <Searchbar
          style={styles.searchBar}
          placeholder="Search for route"
          icon={props => <Icon {...props} name="menu" color={Theme.PrimaryColor} />}
          onChangeText={this._handleTextChange}
          clearIcon={props => <Icon {...props} name="close" />}
        />
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
  searchBar: {
    marginTop: 8,
    position: "absolute",
    alignSelf: "center",
    width: (Dimensions.get("window").width - 32),
  },
});