import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip, Divider } from 'react-native-paper';


export default class RouteOptionsSlider extends React.Component {

  constructor(props) {
    super(props);

    let chipSelected = this.props.routes.map(route => false);
    chipSelected[0] = true;

    this.state = {
      chipSelected, // state of each respoective chip
    }
  }

  _fetchRouteReports = (route_id, index) => {
    requestAnimationFrame(() => { // make the process of chip selection smoother
      let chipSelected = this.state.chipSelected.map(state => false);
      chipSelected[index] = true;
      this.setState({chipSelected});
      
      this.props._fetchRouteReports(route_id);
      // unhealthy (chocked updated to the component unless the update is forced by the Chip press)
    });
  }

  _renderRouteChips = () => (
    this.props.routes.map((route, index) => (
      <Chip 
        selected={this.props.active == route.route_id}
        onPress={this._fetchRouteReports.bind(this, route.route_id, index)}
        key={index.toString()}
        style={styles.chip}
        mode="outlined"
      >
        {`Route ${route.route_short_name}`}
      </Chip>
    ))
  );

  render() {

    return (
      <ScrollView 
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.optionSlider}
      >
        {this._renderRouteChips()}
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  optionSlider: {
    minHeight: 50,
    maxHeight: 50,
    padding: 4,
    paddingBottom: 8,
  },
  chip: {
    padding: 4,
    marginEnd: 4,
    marginStart: 4
  },
  divider: {
    color: "white",
    backgroundColor: "white",
  },
});
