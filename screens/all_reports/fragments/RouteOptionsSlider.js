import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';


export default class RouteOptionsSlider extends React.PureComponent {

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
    });
  }

  _renderRouteChips = () => (
    this.props.routes.map((route, index) => (
      <Chip 
        selected={this.state.chipSelected[index]}
        onPress={this._fetchRouteReports.bind(this, route.route_id, index)}
        key={index.toString()}
      >
        {`Route ${route.route_short_name}`}
      </Chip>
    ))
  );

  render() {

    return (
      <ScrollView 
        horizontal={true}
        style={styles.optionSlider}
      >
        {this._renderRouteChips()}
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  optionSlider: {},
});
