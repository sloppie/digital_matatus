import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { List, Colors, Title, Chip, Divider } from 'react-native-paper';
import { API } from '../../../utilities';
import { PieChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

import Theme from '../../../theme';

// prevent loading of a module that may not be directly used
// let DatePicker = null;
const year = 1000 * 60 * 60 * 24 * 365;


class Filters extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      fromDate: new Date().getTime() - year,
      toDate: new Date().getTime(), // by default is the time it is when the screen renders
      activeDate: "", // help know which date to set
      filterByDate: false,
      filterByLocationType: false,
      showDatePicker: false,
      location_type: "",
    };
  }

  toggleDateFilter = () => this.setState({filterByDate: !this.state.filterByDate});

  toggleLocationTypeFilter = () => this.setState({filterByLocationType: !this.state.filterByLocationType});

  revealDateTimePicker = (activeDate) => this.setState({activeDate, showDatePicker: true})

  _renderDateFilters = () => (
    <>
      <View style={styles.dateContainer}>
        <Title style={styles.categoryTitle}>Date Filters</Title>
        <View style={styles.dateSectionContainer}>
          <Title style={styles.dateSectionTitle}>From: </Title>
          <Chip 
            mode="outlined"
            onPress={this.revealDateTimePicker.bind(this, "fromDate")}>
              {new Date(this.state.fromDate).toDateString()}
          </Chip>
        </View>
        <View style={styles.dateSectionContainer}>
          <Title style={styles.dateSectionTitle}>To: </Title>
          <Chip 
            mode="outlined"
            onPress={this.revealDateTimePicker.bind(this, "toDate")}>
              {new Date(this.state.toDate).toDateString()}
          </Chip>
        </View>
      </View>
      <Divider />
    </>
  );

  _setDate = (event, date) => {
    this.setState({
      [this.state.activeDate]: date.getTime(),
      showDatePicker: false,
    });
  }

  renderDatePicker = () => {

    // if(!DateTimePicker)
    //   DateTimePicker = require('@react-native-community/datetimepicker');

    return (
      <DateTimePicker 
        mode="date"
        onChange={this._setDate}
        value={this.state[this.state.activeDate]}
      />
    );
  }

  _setLocationFilter = (location_type) => this.setState({location_type});

  _renderLocationFilters = () => (
    <View style={styles.locationContainer}>
      <Title style={styles.categoryTitle}>Location Filters</Title>
      <View style={styles.locationFilterContainer}>
        <Chip
          mode="outlined"
          style={styles.filterCategoryChip}
          selected={this.state.location_type === "INSIDE_BUS"}
          onPress={this._setLocationFilter.bind(this, "INSIDE_BUS")}
        >
          Inside Bus
        </Chip>
        <Chip
          mode="outlined"
          style={styles.filterCategoryChip}
          selected={this.state.location_type === "ON_BUS_TERMINAL"}
          onPress={this._setLocationFilter.bind(this, "ON_BUS_TERMINAL")}
        >
          On Bus Entrance
        </Chip>
        <Chip
          mode="outlined"
          style={styles.filterCategoryChip}
          selected={this.state.location_type === "BUS_TERMINAL"}
          onPress={this._setLocationFilter.bind(this, "BUS_TERMINAL")}
        >
          On Bus Terminal
        </Chip>
      </View>
      <Divider />
    </View>
  );

  /**
   * This method gets the filters enlisted by the user and packs them in an object that will be unpacked
   * by `API.filterByCategory`
   * 
   * @returns {{date: String, location_type: String}} an object of all filters
   */
  getFilters = () => {
    let filters = {};
    filters.date = `${this.state.fromDate}:${this.state.toDate}`;

    if(this.state.location_type)
      filters.location_type = this.state.location_type;
    
    return filters;
  }

  render() {

    return (
      <>
        <Title style={styles.categoryTitle}>Filter by</Title>
        <View style={styles.filterWrapper}>
          <Chip 
            selected={this.state.filterByDate} 
            style={styles.filterCategoryChip} 
            onPress={this.toggleDateFilter}
            mode="outlined">
              Date
          </Chip>
          <Chip 
            style={styles.filterCategoryChip} 
            selected={this.state.filterByLocationType} 
            onPress={this.toggleLocationTypeFilter}
            mode="outlined">
              Location Type
          </Chip>
        </View>
        <Divider />
        {this.state.filterByDate ? this._renderDateFilters(): null}
        {this.state.filterByLocationType ? this._renderLocationFilters(): null}
        <Divider />
        {this.state.showDatePicker ? this.renderDatePicker(): null}
      </>
    );
  }

}

const LOCATION_TYPES = Object.freeze({
  "INSIDE_BUS": "INSIDE_BUS",
  "BUS_TERMINAL": "BUS_TERMINAL",
  "ON_BUS_ENTRANCE": "ON_BUS_ENTRANCE"
});

export default class Stats extends React.Component {

  /**
   * this is used to access the Filters Component (to get the filters Object)
   */
  filtersRef: React.RefObject<Filters> = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      "INSIDE_BUS": 0,
      "BUS_TERMINAL": 0,
      "ON_BUS_ENTRANCE": 0,
      date: new Date(),
      startDate: null,
      endDate: null,
    };

  }

  componentDidMount = () => {
    let parentFilters = this.props.getParentFilters();

    API.filterByCategories(
      {route_id: this.props.route.route_id, ...parentFilters},
      this._setTotal,
      this._setTotal.bind(this, [])
    );

    this.setState({parentFilters});

    // this.fetchFilters();
    // setTimeout(this.fetchFilters, 5000);
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

  setParentFilters = (parentFilters) => {
    this.setState({parentFilters})

    this.fetchGraphData(parentFilters);
  }

  fetchGraphData = (parentFilters) => {
    this.fetchTotal(parentFilters);
    this._getLocationGraph(parentFilters);
  }

  fetchTotal = (parentFilters = null) => {

    let pf = (parentFilters !== null)? parentFilters: this.state.parentFilters;

    API.filterByCategories(
      {route_id: this.props.route.route_id, ...pf},
      this._setTotal,
      this._setTotal.bind(this, [])
    );
  }

  _setTotal = (total) => {
    console.log("Setting total to: " + total.length);
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

  _setIBNumbers = (data) => this.setState({"INSIDE_BUS": data.length});

  _setBTNumbers = (data) => this.setState({"BUS_TERMINAL": data.length});

  _setOBENumbers = (data) => this.setState({"ON_BUS_ENTRANCE": data.length});

  _getLocationGraph = (parentFilters=null) => {
    let pf = (parentFilters !== null)? parentFilters: this.state.parentFilters;

    let route_id = this.props.route.route_id;
    let insideBus = {route_id, ...pf, location_type: "INSIDE_BUS"};
    let onBusTerminal = {route_id, ...pf, location_type: "BUS_TERMINAL"};
    let onBusEntrance = {route_id, ...pf, location_type: "ON_BUS_ENTRANCE"};

    setTimeout(
      API.filterByCategories.bind(this, insideBus, this._setIBNumbers, this._setIBNumbers.bind(this, [])),
      200
    );

    setTimeout(
      API.filterByCategories.bind(this, onBusTerminal, this._setBTNumbers, this._setBTNumbers.bind(this, [])),
      600,
    );

    setTimeout(
      API.filterByCategories.bind(this, onBusEntrance, this._setOBENumbers, this._setOBENumbers.bind(this, [])),
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

  fetchFilters = () => {
    let filters = this.filtersRef.current.getFilters();

    API.filterByCategories(
      {report_id: this.props.route.route_id, ...filters},
      (response) => console.log(response.length),
      (err) => {console.log(err)}
    );
  }

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


    return (


      <ScrollView style={{flex: 1, width: "100%", height: "100%"}}>
        {/* <Filters ref={this.filtersRef}/> */}
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
        <Text style={styles.reportedCases}>{this.state.total}</Text>
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
  // Filters styles
  categoryTitle: {
    marginTop: 8,
    marginStart: 8,
  },
  filterWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  filterCategoryChip: {
    marginEnd: 4,
  },
  dateContainer: {
  },
  dateSectionContainer: {
    marginStart: 16,
    flexDirection: "row",
    marginBottom: 4,
  },
  dateSectionTitle: {
    fontWeight: "300",
    fontFamily: Theme.OpenSansBold,
    marginEnd: 8,
  },
  locationContainer: {},
  locationFilterContainer: {
    flexDirection: "row",
    marginStart: 16,
    padding: 4,
  },
  locationSectionTitle: {
    marginEnd: 8,
  },
});
