import React from 'react';
import {
  SafeAreaView,
  View,
  ToastAndroid,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Searchbar, Surface, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE, Marker, OverlayComponent } from 'react-native-maps';

const RNShake = require('react-native-shake');

import * as Fragments from './fragments';
import Theme from '../../theme';
import { HOME_NAVIGATION_REF } from '../../routes/AppDrawer';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from '../../utilities';

let GTFSSearch = null;
let TRIPS = null;

const SHAPES = require("../../GTFS_FEED/shapes/shape.json");


export default class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchBar: "",
      results: [],
      markers: [],
      region: {
        latitude: -1.28123,
        longitude: 36.822596,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }
    };
  }

  async componentDidMount() {

    AsyncStorage.multiGet(
      ["reportSaved", "reportToUpdate"],
      (err, result) => {
        
        if(err) {
          console.log("ERR_FETCHING");
        } else {
          let reportSaved; 

          try {
            console.log("reportSaved")
            console.log(result[0]);
            reportSaved = JSON.parse(result[0][1]);
          } catch(err) {
            reportSaved = "";
          }

          console.log("report saved");
          console.log(reportSaved);
          if(reportSaved !== "" && reportSaved !== null) {
            API.resendReport();
            return; // break here because there is obviouslu no reportSaved ID
          }

          let reportToUpdate; 
          
          try {
            console.log("reportToUpdate")
            console.log(result[1]);
            reportToUpdate = JSON.parse(result[1][1]);
          } catch(err) {
            reportToUpdate = "";
          }

          console.log("reportToUpdate");
          console.log(reportToUpdate);
          if(reportToUpdate !== "" && reportToUpdate !== "FETCH_REPORT_ID" && reportToUpdate !== null) {
            this.props.navigation.navigate("NumberPlate"); // update reports
          }

        }

      }
    );

    RNShake.addEventListener("ShakeEvent", this._reportIncident.bind(this));
  }

  componentWillUnmount() {
    RNShake.removeEventListener("ShakeEvent");
  }

  _openDrawer = () => HOME_NAVIGATION_REF.openDrawer();

  _reportIncident = () => HOME_NAVIGATION_REF.navigate("Report");

  _handleTextChange = (text) => {

    this.setState({
      searchBar: text
    });
    this._updateSearchEntry(text);

  }

  _updateSearchEntry = async (entry) => {

    if(GTFSSearch == null) {
      let node = require('../../utilities').GTFSSearch;
      GTFSSearch = new node("routes");
    }

    let results = await GTFSSearch.searchSpecific("Route Long Name", entry);
    
    if(this.state.searchBar === entry) {
      this.setState({results});
    }
  }

  _renderSearchResults = () => {
    
    if(TRIPS == null)
      TRIPS = require('../../GTFS_FEED/trips/trips.json');

    let rendered = [];

    if(this.state.results == [] || this.state.searchBar == "")
      return [];

    let {results} = this.state;
    let batchSize = (results.length > 4)? 4: results.length;

    for(let i=0; i<batchSize; i++) {
      rendered.push(
        <Fragments.MiniRouteCard
          trip={TRIPS[results[i].data.route_id]}
          navigation={this.props.navigation}
          route_details={results[i].data}
          key={i.toString()}
        />
      );
    }

    return rendered;
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
        <View style={styles.searchContainer}>
          <Searchbar
            value={this.state.searchBar}
            style={styles.searchBar}
            placeholder="Search for route"
            onChangeText={this._handleTextChange}
            icon="menu"
            onIconPress={this._openDrawer}
          />
          {(this.state.results !== []) ? this._renderSearchResults(): null}
        </View>
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
  searchContainer: {
    width: "100%",
    position: "absolute",
    top: 8,
  },
  searchBar: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 8,
  },
  iconContainer: {
    padding: 8, 
  },
  icon: {
    textAlignVertical: "center",
  },
});