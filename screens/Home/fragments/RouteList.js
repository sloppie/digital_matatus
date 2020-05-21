import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import RouteCard from './RouteCard';

import AsyncStorage from '@react-native-community/async-storage';

const ROUTES = require('../../../GTFS_FEED/routes/routes.json');
const TRIPS = require('../../../GTFS_FEED/trips/trips.json');

/**
 * @todo add an event listener for FAVOURITES_ALTERED to help update once this happens
 */
export default class RouteList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      routes: []
    };
  }

  componentDidMount() {
    this.fetchFavourites();
  }

  fetchFavourites = async () => { 
    /**
     * @todo export all stored database variables
     */
    let routes = JSON.parse(await AsyncStorage.getItem("favouriteRoutes"));

    this.setState({
      routes
    });
  }

  generateRouteCards = () => {
    let routes = [];

    this.state.routes.forEach((route) => {

      
      routes.push(
        <RouteCard 
          key={route.route_id} 
          route={route} 
          trip={TRIPS[route.route_id]}
          setBusTerminalMarker={this.props.setBusTerminalMarker}
          navigation={this.props.navigation}
        />
    )});

    return routes;
  }

  render() {

    return (
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        pagingEnabled={true}
      >
        {this.generateRouteCards()}
      </ScrollView>
    );
  }

}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    start: 0,
  }
});