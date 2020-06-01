import React from 'react';
import { ScrollView, StyleSheet, Dimensions, DeviceEventEmitter } from 'react-native';
import { Card, List, Colors, FAB } from 'react-native-paper';
import Permissions from '../../../utilities/permissions';
import AsyncStorage from '@react-native-community/async-storage';
import { CONFIG_COMPLETE } from '../../../store';


export default class Confirm extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
    };
  }

  _renderRoutes = () => {
    let routes = JSON.parse(this.props.user.favouriteRoutes);
    let routesDetails = require('../../../GTFS_FEED/routes/routes.json');

    let routeCards = routes.map(route => {
      let routeDetails = routesDetails[route];

      return (
        <Card style={styles.routeCard}>
          <Card.Title 
            left={props => <List.Icon {...props} icon="bus" />}
            title={`Route ${routeDetails.route_short_name}`}
            description={routeDetails.route_long_name}
            right={props => <List.Icon {...props} icon="heart" color={Colors.red600} />}
          />
        </Card>
      )
    });

    return routeCards;
  }

  _confirm = async () => {
    // ask for perminssions
    this.setState({fetching: true});
    let res = await Permissions.requestAllPermissions();
    let deviceToken = await AsyncStorage.getItem("deviceNotificationToken");

    const unpackRoutes = (routes) => {
      let STORED_ROUTES = require('../../../GTFS_FEED/routes/routes.json');

      return routes.map(_id => STORED_ROUTES[_id])
    }

    if(deviceToken) {
      fetch("http://192.168.43.99:3000/api/user/login", 
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email: this.props.email,
          deviceToken
        })
      }
    ).then(response => response.json()).then(data => {
      let payload = null;

      try {
        payload = JSON.parse(data);
      } catch(err) {
        console.log("unable to parse payload");
      }

      if(payload) {
        AsyncStorage.multiSet(
          [
            ['favouriteRoutes', unpackRoutes(payload.favouriteRoutes)],
            ["reported", payload.reported],
            ["reportsFollowed", payload.reportsFollowed],
            ["userID", payload._id]
          ],
          (err) => {

            if(!err) {
              // configuration complete
              DeviceEventEmitter.emit(CONFIG_COMPLETE);
            }

          }
        );
      } else {}

    }).catch(err => console.log(err));
    }

  }

  render() {

    return (
      <>
        <ScrollView stickyHeaderIndices={[0]}>
          <List.Section title="Your favuorite routes" />
          {this._renderRoutes()}
        </ScrollView>
        <FAB 
          style={styles.fab}
          loading={this.state.fetching}
          label="Confirm"
          icon="check"
          onPress={this._confirm}
        />
      </>
    );
  }

}

const styles = StyleSheet.create({
  routeCard: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
  },
  fab: {
    position: "absolute",
    bottom: 16,
  },
});
