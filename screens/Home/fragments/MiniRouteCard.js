import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../../theme';


export default class MiniRouteCard extends React.PureComponent {

  _seeMore = () => {
    this.props.navigation.navigate(
      "RouteDetails",
      {
        route: this.props.route_details,
        trip: this.props.trip
      }
    )
  }

  render() {

    return (
      <Card 
        style={styles.card}
        onPress={this._seeMore}>
        <Card.Title 
          left={props => <Icon {...props} name="bus" color={Theme.PrimaryColor} />}
          title={`Route ${this.props.route_details.route_short_name}`}
          titleStyle={styles.cardTitle}
          subtitle={this.props.route_details.route_long_name}
        />
      </Card>
    );
  }

}

const styles = StyleSheet.create({
  card: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: Theme.OpenSansBold
  },
});
