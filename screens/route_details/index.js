import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  Card,
  List
} from 'react-native-paper';
import MapView, { PROVIDER_OSMDROID, Marker } from 'react-native-maps-osmdroid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../theme';
import * as Fragments from './fragments';

// import { API, ReportParser } from '../../utilities';
import * as API from '../../utilities/API';
import ReportParser from '../../utilities/report_parser';

// import STOPS from '../../GTFS_FEED/stops/stops.json';
import SHAPES from '../../GTFS_FEED/shapes/shape.json';

const STOPS = require('../../GTFS_FEED/stops/stops.json')
const COMPREHENSIVE_ROUTES = require('../../GTFS_FEED/comprehensive_routes/comprehensive_routes.json');

console.log("RoutetDetails is being loaded");

export default class RouteDetails extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      route_id: this.props.route.params.route.route_id,
      markers: [],
      region: {
        latitude: -1.28123,
        longitude: 36.822596,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      comprehensive_routes: {stops:[], to: [], from: [] },
      activeTab: 0,
      routesLoaded: false,
      reports: [],
      categories: {},
      statsMounted: false,
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

    this.filterReportsByCategory();
  }
  
  ratingsListRef = React.createRef();
  statsRef = React.createRef();

  setReports = (reports) => {
    this.setState({reports});
    this.ratingsListRef.current._setReports(reports);

  }

  filterReportsByCategory = (categories) => {

    this.setState({categories});

    API.filterByCategories(
      {route_id: this.state.route_id, ...categories},
      this.setReports.bind(this),
      this.setReports.bind(this, [])
    );

    // send out the new categories to the StatsTab
    if(this.state.statsMounted)
      this.statsRef.current.setParentFilters(categories);
  }

  getParentFilters = () => {
    this.setState({statsMounted: true});

    return this.state.categories;
  }

  setActiveTab = (activeTab) => this.setState({activeTab});

  getComprehensiveRoute() {
    return new Promise((resolve, reject) => {
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

  _generateReportLocationMarkers = () => {
    let markers = [];

    this.state.reports.forEach(report => {
      let parsedReport = new ReportParser(report);

      markers.push(
        <Marker 
          key={report._id}
          title={report._id}
          coordinate={parsedReport.incidentDescription.location.coordinates}
          description={parsedReport.incidentDescription.location.type}
        />
      );

    });

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
    
    return (
      <Fragments.DetailsTab 
        style={styles.detailsTab}
        listItemAction={this.listItemActions[0]}
        data={{...this.state.comprehensive_routes}}
        secondaryNavigation={this.props.navigation}
        route={this.props.route.params.route}
        reports={this.state.reports}
        filterReportsByCategories={this.filterReportsByCategory}
        ratingsListRef={this.ratingsListRef}
        statsRef={this.statsRef}
        getParentFilters={this.getParentFilters}
      />
    );

  }

  render() {

    return (
      <>
        <StatusBar 
          backgroundColor="purple" 
          barStyle="light-content"
        />
        <SafeAreaView style={styles.screen}>
          <Card style={styles.card}>
            <MapView 
              provider={PROVIDER_OSMDROID}
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
              {(this.state.reports.length > 0) && this._generateReportLocationMarkers()}
            </MapView>
            <Card.Title 
              style={styles.cardTitleContainer}
              left={props => <List.Icon {...props} icon="bus" style={styles.cardLeft}/>}
              title={`Route ${this.props.route.params.route.route_short_name}`}
              titleStyle={styles.cardTitle}
              subtitle={this.props.route.params.route.route_long_name}
            />
          </Card>
          {(this.state.routesLoaded)?this._renderListView(): <View />}
        </SafeAreaView>
      </>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: Dimensions.get("window").height,
  },
  card: {
    height: Math.floor(Dimensions.get("window").height * 0.4),
    elevation: 0,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    borderBottomColor: "#f4f4f4"
  },
  cardTitleContainer: {
    backgroundColor: "white",
  },
  cardLeft: {
    borderWidth: 2,
    borderColor: "purple",
    alignSelf: "center",
    borderRadius: 32,
  },
  cardTitle: {
    fontFamily: Theme.OpenSansBold,
    color: "purple",
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
  detailsTab: {
    height: Math.floor(Dimensions.get('window').height * 0.6),
  },
});
