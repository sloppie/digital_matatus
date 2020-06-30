import React from 'react';
import { ScrollView, View, StyleSheet} from 'react-native';
import { Title, Chip, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import Theme from '../../../theme';

const DAY = 1000 * 60 * 60 * 24;
const YEAR = DAY * 365;


export default class Filters extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      fromDate: new Date().getTime() - YEAR,
      toDate: new Date().getTime(), // by default is the time it is when the screen renders
      activeDate: null, // help know which date to set
      filterByDate: false,
      filterByLocationType: false,
      showDatePicker: false,
      location_type: "",
      // filters for chips
      filterByAll: true,
      filterBy7: false,
      filterBy14: false,
      filterBy30: false,
    };
  }

  // this is used to set and reset the filter chips
  /**
   * 
   * @param {String} number number of days to filter by
   */
  filterBy = (number) => {
    let newFilterObj = {
      filterByAll: false,
      filterBy7: false,
      filterBy14: false,
      filterBy30: false,
    };

    newFilterObj[`filterBy${number}`] = true;

    if(number == "All")
      newFilterObj.activeDate = null;
    else {
      newFilterObj.activeDate = number;
    }

    this.setState({...newFilterObj});

    this.props.filterReportsByCategories(this.getFilters(number));
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
  getFilters = (number) => {
    let filters = {};

    if(number !== "All") {
      let fromDate = (this.state.toDate -  DAY * Number(number));
      filters.date = `${fromDate}:${this.state.toDate}`;
    }

    return filters;
  }

  /**
   * This function is used to update the filters to the reports that will be showcased
   * on the RouteDetails screen.
   * It calls on the `this.props.setFilters` which is passed on from the ReportDetails
   * screen to ensure that each child component screen in the entire list is updated.
   * 
   */
  setFilterCategories = () => {
    this.props.setFilterCategories(this.getFilters());
  }

  render() {

    return (
      <>
        <ScrollView 
          showsHorizontalScrollIndicator={false} 
          horizontal={true} 
          style={styles.filterWrapper}>
          {/* <Chip 
            selected={this.state.filterByDate} 
            style={styles.filterCategoryChip} 
            onPress={this.toggleDateFilter}
            mode="outlined">
              Date
          </Chip> */}
          <Chip 
            selected={this.state.filterByAll} 
            style={styles.filterCategoryChip} 
            onPress={this.filterBy.bind(this, "All")}
            mode="outlined">
              All
          </Chip>
          <Chip 
            selected={this.state.filterBy7} 
            style={styles.filterCategoryChip} 
            onPress={this.filterBy.bind(this, "7")}
            mode="outlined">
              Past 7 Days
          </Chip>
          <Chip 
            selected={this.state.filterBy14} 
            style={styles.filterCategoryChip} 
            onPress={this.filterBy.bind(this, "14")}
            mode="outlined">
              Past 14 Days
          </Chip>
          <Chip 
            /* onLayout={(e) => console.log(e.nativeEvent)} */
            selected={this.state.filterBy30} 
            style={styles.filterCategoryChip} 
            onPress={this.filterBy.bind(this, "30")}
            mode="outlined">
              Past 30 Days
          </Chip>
          {/* <Chip 
            style={styles.filterCategoryChip} 
            selected={this.state.filterByLocationType} 
            onPress={this.toggleLocationTypeFilter}
            mode="outlined">
              Location Type
          </Chip> */}
        </ScrollView>
        <Divider />
        {this.state.filterByDate ? this._renderDateFilters(): null}
        {this.state.filterByLocationType ? this._renderLocationFilters(): null}
        <Divider />
        {this.state.showDatePicker ? this.renderDatePicker(): null}
      </>
    );
  }

}

const styles = StyleSheet.create({
  titleStyle: {
    fontFamily: Theme.OpenSansBold
  },
  categoryTitle: {
    marginTop: 8,
    marginStart: 8,
  },
  filterWrapper: {
    flexDirection: "row",
    padding: 8,
    minHeight: 49,
    maxHeight: 49,
  },
  filterCategoryChip: {
    marginEnd: 4,
    height: 33,
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
