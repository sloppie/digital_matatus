import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { List, Colors, Title } from 'react-native-paper';
import { API } from '../../../utilities';
import { PieChart } from 'react-native-chart-kit';

const LOCATION_TYPES = Object.freeze({
  "INSIDE_BUS": "INSIDE_BUS",
  "BUS_TERMINAL": "BUS_TERMINAL",
  "ON_BUS_ENTRANCE": "ON_BUS_ENTRANCE"
});

export default class Stats extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      "INSIDE_BUS": 0,
      "BUS_TERMINAL": 0,
      "ON_BUS_ENTRANCE": 0,
    };

  }

  componentDidMount = () => {
    API.filterByCategories(
      {route_id: this.props.route.route_id},
      this._setTotal,
      this._setTotal.bind(this, [])
    );

    this._getLocationGraph();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.total !== nextState.total ||
      this.state.INSIDE_BUS !== nextState.INSIDE_BUS ||
      this.state.ON_BUS_ENTRANCE !== nextState.ON_BUS_ENTRANCE ||
      this.state.INSIDE_BUS !== nextState.INSIDE_BUS
    );
  }

  _setTotal = (total) => {
    console.log("Setting total to: " + total.length)
    this.setState({total: total.length});
    this.forceUpdate();
  }

  _setLocationType = (data) => {
    
    if(data.length > 0) {
      let location_type = JSON.parse(data[0].incidentDescription).location.type;

      // console.log(`setting ${location_type} to ${data.length}`);
      this.setState({[location_type]: data.length});
      this.forceUpdate();
    }

  }

  _getLocationGraph = () => {
    let route_id = this.props.route.route_id;
    let insideBus = {route_id, location_type: "INSIDE_BUS"};
    let onBusTerminal = {route_id, location_type: "BUS_TERMINAL"};
    let onBusEntrance = {route_id, location_type: "ON_BUS_ENTRANCE"};

    setTimeout(
      API.filterByCategories.bind(this, insideBus, this._setLocationType, this._setLocationType.bind(this, [])),
      200
    )
    setTimeout(
      API.filterByCategories.bind(this, onBusTerminal, this._setLocationType, this._setLocationType.bind(this, [])),
      600,
    );
    setTimeout(
      API.filterByCategories.bind(this, onBusEntrance, this._setLocationType, this._setLocationType.bind(this, [])),
      1100
    );


  }

  _generateGraphData = () => {
    let data = [
        {
          name: "Inside Bus",
          number: this.state.INSIDE_BUS,
          color: Colors.blue900,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "On bus entrance",
          number: this.state.ON_BUS_ENTRANCE,
          color: Colors.blue500,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
        {
          name: "Bus terminal",
          number: this.state.BUS_TERMINAL,
          color: Colors.blue100,
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        },
      ];

    return data;
  }

  sliceColors = [Colors.red500, Colors.green400, Colors.yellow500];

  render() {
    let width = (Dimensions.get("window").width);

    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false // optional
    };

    let slice = [
      this.state.BUS_TERMINAL,
      this.state.INSIDE_BUS,
      this.state.ON_BUS_ENTRANCE
    ];
    let renderTotal = () => this.state.total;

    return (


      <ScrollView style={{flex: 1, width: "100%", height: "100%"}}>
        <List.Section 
          title="Graph of incident filtered by location"
        />
        {
          (this.state.INSIDE_BUS || this.state.BUS_TERMINAL || this.state.ON_BUS_ENTRANCE) ?
            <PieChart 
              data={this._generateGraphData()}
              chartConfig={chartConfig}
              accessor="number"
              width={width}
              height={220}
              style={styles.pieChart}
              paddingRight={8}
            />
          : null
        }
        {/* <Text>INSIDE_BUS: {this.state.INSIDE_BUS}</Text>
        <Text>ON_BUS_ENTRANCE: {this.state.ON_BUS_ENTRANCE}</Text>
        <Text>BUS_TERMINAL: {this.state.BUS_TERMINAL}</Text> */}
        <Text style={styles.reportedCases}>{`Total reported cased: ${renderTotal()}`}</Text>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  graph: {
    flex: 1,
    height: 400,
    width: 400,
    alignSelf: "center"
  },
  pieChart: {
    alignSelf: "center"
  },
  reportedCases: {
    textAlign: "center",
    fontWeight: "600"
  },
});
