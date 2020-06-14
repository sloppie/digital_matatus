import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList
} from 'react-native';
import {
  Card,
  List
} from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Theme from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Fragments from './fragments';

// import STOPS from '../../GTFS_FEED/stops/stops.json';
import SHAPES from '../../GTFS_FEED/shapes/shape.json';

const STOPS = require('../../GTFS_FEED/stops/stops.json')
const COMPREHENSIVE_ROUTES = require('../../GTFS_FEED/comprehensive_routes/comprehensive_routes.json');

export default class RouteDetails extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      region: {
        latitude: -1.28123,
        longitude: 36.822596,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      comprehensive_routes: {stops:[], to: [], from: [] },
      activeTab: 0,
      routesLoaded: false
    };

    this.from = "";
    this.to = "";
    this._tabs = ["Stops", "Saccos", "Forum"];
    this._icons = ["bus-articulated-front", "office-building", "message-processing"];
    this.tabActions = [
      this.setActiveTab.bind(this, 0),
      this.setActiveTab.bind(this, 1),
      this.setActiveTab.bind(this, 2),
    ]

    this.listItemActions = [
      this._setStopIDMarker,
      this._setStopIDMarker,
      this._setStopIDMarker,
    ];

    this.comprehensiveRoutes = null; // this will be used to store the data filed from comprehensive_routes

  }

  componentDidMount() {
    this.setBusTerminalMarker(this.props.route.params.trip);
    this.setComprehensiveRoutes();
  }

  setActiveTab = (activeTab) => this.setState({activeTab});

  getComprehensiveRoute() {
    return new Promise((resolve, reject) => {
      console.log("This promise ran")
      let routes;
      try {
        routes = COMPREHENSIVE_ROUTES[this.props.route.params.route.route_id];
        console.log(`${routes.stops.length}: is the length of unique stops`);
        resolve(routes);
      } catch(err) {
        
        if(err) {
          console.log("an error ocurred while processing comprehensive routes");
          reject({stops: []});
        }
      }

    });

  }

  setComprehensiveRoutes = () => {
    this.getComprehensiveRoute()
        .then(comprehensive_routes => this.setState({comprehensive_routes, routesLoaded: true}))
        .catch((err) => console.log(err));
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

  _setStopIDMarker = (data) => {
    let coordinate = {
      latitude: Number(data.coordinates.stop_lat),
      longitude: Number(data.coordinates.stop_lon),
    };

    // region will need to be changed  to account for the new marker
    let region = {...this.state.region}; 
    region.latitude = coordinate.latitude;
    region.longitude = coordinate.longitude;

    let markers = [
      {
        name: data.name,
        coordinate
      },
    ];

    this.setState({markers, region});
  }

  _generateBusTerminalMarkers = () => {
    let markers = [];

    this.state.markers.forEach(marker => markers.push(
      <Marker 
        key={marker.title}
        title={marker.title}
        coordinate={marker.coordinate}
        description={marker.description}
      />
    ));

    return markers;
  }

  _generateStopsList = (type) => {
    let stops = [];

    let len = (this.state.comprehensive_routes[type].length < 5)? 
      this.state.comprehensive_routes[type].length
      : 5;

    for(let i=0; i<len; i++) {
      
      let key = this.state.comprehensive_routes[type][i];      
      console.log(key)
      let data = STOPS[key];

      if(!i && !this.from) {
        this.from = data.name;
      } else if(!i) {
        this.to = data.name;
      }

      stops.push(
        <List.Item 
          key={key}
          title={data.name}
          description={key}
          onPress={this._setStopIDMarker.bind(this, data)}
        />
      );
    }

    return stops;
  }

  _renderListView() {
    
    // switch(this.state.activeTab) {
    //   case 0:
    //     return(
    //        <Fragments.ListView 
    //           name={this._tabs[0]} 
    //           listItemAction={this.listItemActions[0]} data={{...this.state.comprehensive_routes}} 
    //           route={this.props.route.params.route}
    //           navigation={this.props.navigation}
    //         />
    //     );
    //   case 1:
    //     return(
    //        <Fragments.ListView 
    //           name={this._tabs[1]} 
    //           listItemAction={this.listItemActions[1]} data={{...this.state.comprehensive_routes}} 
    //           route={this.props.route.params.route}
    //           navigation={this.props.navigation}
    //         />
    //     );
    //   case 2: 
    //     return(
    //        <Fragments.ListView 
    //           name={this._tabs[2]} 
    //           listItemAction={this.listItemActions[2]} data={{...this.state.comprehensive_routes}} 
    //           route={this.props.route.params.route}
    //           navigation={this.props.navigation}
    //         />
    //     );
    // }

    return (
      <Fragments.DetailsTab 
        listItemAction={this.listItemActions[0]}
        data={{...this.state.comprehensive_routes}}
        secondaryNavigation={this.props.navigation}
        route={this.props.route.params.route}
      />
    );

  }

  render() {

    return (
      <>
        <StatusBar 
          backgroundColor="transparent" 
          barStyle="dark-content" 
        />
        <SafeAreaView style={styles.screen}>
          <Card style={styles.card}>
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
              {this._generateBusTerminalMarkers()}
            </MapView>
            <Card.Title 
              left={props => <Icon {...props} name="bus"/>}
              title={`Route ${this.props.route.params.route.route_short_name}`}
              titleStyle={styles.cardTitle}
              subtitle={this.props.route.params.route.route_long_name}
            />
          </Card>
          {/* <Fragments.TabBar 
            tabs={this._tabs}
            icons={this._icons}
            actions={this.tabActions}
          /> */}
          {(this.state.routesLoaded)?this._renderListView(): <View />}
        </SafeAreaView>
      </>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
  },
  card: {
    height: "40%",
    elevation: 0
  },
  cardTitle: {
    fontFamily: Theme.OpenSansBold
  },
  map: {
    height: "75%"
  },
  scrollView: {
    height: "30%",
  },
  flatList: {
    height: "30%"
  },
});
