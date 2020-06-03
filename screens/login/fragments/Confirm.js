import React from 'react';
import { ScrollView, StyleSheet, Dimensions, DeviceEventEmitter, SafeAreaView } from 'react-native';
import { Title, Card, List, Colors, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Permissions from '../../../utilities/permissions';
import AsyncStorage from '@react-native-community/async-storage';
import { CONFIG_COMPLETE } from '../../../store';
import Theme from '../../../theme';


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
            subtitle={routeDetails.route_long_name}
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
      let favouriteRoutes = routes.map(id => STORED_ROUTES[id]);

      return JSON.stringify(favouriteRoutes);
    }

    if(deviceToken) {
      console.log(deviceToken);
      fetch("http://192.168.43.89:3000/api/user/login", 
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email: this.props.user.email,
          deviceToken: deviceToken // the string is stringified a second time when being stored
        })
      }
    ).then(response => response.json()).then(data => {
      let payload = data;

      if(payload) {
        AsyncStorage.multiSet(
          [
            ['favouriteRoutes', unpackRoutes(JSON.parse(payload.favouriteRoutes))],
            ["reported", payload.reported],
            ["reportsFollowed", payload.reportsFollowed],
            ["userID", payload._id]
          ],
          (err) => {

            if(!err) {
              // configuration complete
              console.log(CONFIG_COMPLETE);
              DeviceEventEmitter.emit(CONFIG_COMPLETE);
            } else {
              console.log(err);
            }

          }
        );
      }

    }).catch(err => console.log(err));
    }

  }

  render() {

    return (
      <SafeAreaView style={styles.screen}>
        <Icon 
          name="chevron-left" 
          size={30} 
          style={styles.appBarIcon} 
          onPress={this.props._goBack}
        />
        <Title style={styles.screenLabel}>This you?</Title>
        <ScrollView 
          style={styles.scrollView}
          stickyHeaderIndices={[0]}>
          <List.Section title="Your favourite routes" titleStyle={styles.sectionTitle}/>
          {this._renderRoutes()}
        </ScrollView>
        <FAB 
          style={styles.fab}
          loading={this.state.fetching}
          label="Confirm"
          icon="check"
          onPress={this._confirm}
          color="white"
        />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    width: Dimensions.get("window").width,
    height: "100%",
    backgroundColor: Theme.PrimaryColor
  },
  screenLabel: {
    marginTop: 16,
    fontSize: 30,
    marginLeft: 16,
    fontFamily: Theme.OpenSansBold,
    color: "white"
  },
  appBarIcon: {
    marginTop: 8,
    paddingLeft: 8,
    color: "white"
  },
  scrollView: {
    width: Dimensions.get("window").width,
    height: "50%",
  },
  sectionTitle: {
    color: "white",
  },
  routeCard: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    alignSelf: "center",
    bottom: 16,
  },
});
