import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Card, Button, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../../theme';


export default class RouteCard extends React.PureComponent {

  // example route stored in this.props.route: 
  // {
  //   route_id: String,
  //   agency_id: String,
  //   route_short_name: String,
  //   route_short_name: String,
  //   route_type: String
  // }
  constructor(props) { 
    super(props);
  }

  _pinTerminal = () => {
    this.props.setBusTerminalMarker(this.props.trip);
  }

  _expandCard = () => {
    this.props.navigation.navigate(
      "RouteDetails", // screen name
      { // parameters
        route: this.props.route,
        trip: this.props.trip
      },
    );
  }

  render() {

    return (
      <Card 
        style={styles.card} 
        onPress={this._expandCard} 
      >
        <Card.Title 
          left={props => <Icon {...props} name="bus" color={Theme.PrimaryColor} />}
          title={`Route: ${this.props.route.route_short_name}`} 
          titleStyle={styles.cardTitle}
          subtitle={this.props.route.route_long_name} subtitleNumberOfLines={2}
          right={props => <Icon {...props} name="heart" style={styles.rightIcon} />}/>
        <Card.Content >
        </Card.Content>
        <Card.Actions>
          <Button
            icon="crosshairs-gps"
            onPress={this._pinTerminal}
            color={Colors.red900}
          >Pin on Map</Button>
          <Button
            icon="settings"
            color={Theme.PrimaryColor}
          >Preference</Button>
        </Card.Actions>
      </Card>
    );
  }

}

const styles = StyleSheet.create({
  card: {
    width: (Dimensions.get("window").width - 40),
    alignSelf: "center",
    marginStart: 20,
    marginEnd: 20,
    backgroundColor: "white",
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: Theme.OpenSansBold,
    color: Theme.PrimaryColor,
  },
  rightIcon: {
    color: Colors.red500,
    marginEnd: 16
  }
});
