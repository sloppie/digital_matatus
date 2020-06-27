import React from 'react';
import { View, Dimensions, ActivityIndicator, StyleSheet, ToastAndroid } from 'react-native';
import { List, Title, Chip, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { DataProvider, RecyclerListView, LayoutProvider } from 'recyclerlistview';
import DateTimePicker from '@react-native-community/datetimepicker';

import Theme from '../../../theme';
import { API } from '../../../utilities';

const SCREEN_WIDTH = Dimensions.get("window").width;


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
        {/* <Title style={styles.categoryTitle}>Filter by</Title> */}
        <View style={styles.filterWrapper}>
          {/* <Chip 
            selected={this.state.filterByDate} 
            style={styles.filterCategoryChip} 
            onPress={this.toggleDateFilter}
            mode="outlined">
              Date
          </Chip> */}
          <Chip 
            selected={this.state.filterByDate} 
            style={styles.filterCategoryChip} 
            onPress={this.toggleDateFilter}
            mode="outlined">
              All
          </Chip>
          <Chip 
            selected={this.state.filterByDate} 
            style={styles.filterCategoryChip} 
            onPress={this.toggleDateFilter}
            mode="outlined">
              Past 7 Days
          </Chip>
          <Chip 
            selected={this.state.filterByDate} 
            style={styles.filterCategoryChip} 
            onPress={this.toggleDateFilter}
            mode="outlined">
              Past 14 Days
          </Chip>
          <Chip 
            selected={this.state.filterByDate} 
            style={styles.filterCategoryChip} 
            onPress={this.toggleDateFilter}
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


class Message extends React.Component {

  // component should not be updateable to increase app speed
  shouldComponentUpdate() {
    return false;
  }

  _viewReport = () => {
    ToastAndroid.show(`show the ${this.props.messageTitle} thread`, ToastAndroid.SHORT);

    this.props.secondaryNavigation.navigate("ReportDetails", {
      report: this.props.report,
    });
  }

  render() {
    return (
      <>
        <List.Item 
          left={props => <Icon {...props} name="file" size={30} style={styles.avatarIcon}/>}
          title={this.props.messageTitle}
          titleStyle={styles.titleStyle}
          description={this.props.comment}
          onPress={this._viewReport}
        />
        
      </>
    );
  }

}


export default class LargeRatingsList extends React.Component {

  constructor(props) {
    super(props);

    this.dataProvider = new DataProvider((r1, r2) => {

      return r1 !== r2
    });

    this.state = {
      dataProvider: [],
      fetching: true,
      filterByAll: true,
      filterBy7: false,
      filterBy14: false,
      filterBy30: false,
    };

    this.layoutProvider = new LayoutProvider(
      (index) => "REPORT",
      (type, dim) => {
        dim.width = SCREEN_WIDTH;
        dim.height = 77;
      }
    );
    
  }

  componentDidMount() {
    API.fetchReportsByRoute(
      this.props.route.route_id,
      this._setReports,
      this._setReports.bind(this, [])
    );
  }

  filterReportsByAll = () => {

    this.setState({
      filterByAll: true,
      filterBy7: false,
      filterBy14: false,
      filterBy30: false,
      fetching: true
    });

    API.filterByCategories(
      {route_id: this.props.route.route_id},
      this._setReports,
      this._setReports.bind([])
    );
  }

  filterReportsBy7 = () => {
    this.setState({
      filterByAll: false,
      filterBy7: true,
      filterBy14: false,
      filterBy30: false,
      fetching: true
    });
    let to = new Date().getTime();
    let from = to - (1000 * 60 * 60 * 24 * 7);
    let date = `${from}:${to}`;
    API.filterByCategories(
      {route_id: this.props.route.route_id, date},
      this._setReports,
      this._setReports.bind([])
    );
  }

  filterReportsBy14 = () => {
    this.setState({
      filterByAll: false,
      filterBy7: false,
      filterBy14: true,
      filterBy30: false,
      fetching: true
    });
    let to = new Date().getTime();
    let from = to - (1000 * 60 * 60 * 24 * 14);
    let date = `${from}:${to}`;
    API.filterByCategories(
      {route_id: this.props.route.route_id, date},
      this._setReports,
      this._setReports.bind([])
    );
  }

  filterReportsBy30 = () => {    
    this.setState({
      filterByAll: false,
      filterBy7: false,
      filterBy14: false,
      filterBy30: true,
      fetching: true
    });

    let to = new Date().getTime();
    let from = to - (1000 * 60 * 60 * 24 * 30);
    let date = `${from}:${to}`;
    API.filterByCategories(
      {route_id: this.props.route.route_id, date},
      this._setReports,
      this._setReports.bind([])
    );
  }

  _setReports = (reports) => {
    // clone new rows
    this.setState({
      dataProvider: new DataProvider(
        (r1, r2) => false, 
        (index) => reports[index]._id
      ).cloneWithRows(reports),
      fetching: false,
    });

    this.forceUpdate();
  }

  _rowRenderer = (type, item) => {
    let incidentDescription = JSON.parse(item.incidentDescription);

    const renderFlags = () => {
      let flags = "Flags: ";
      let harrassmentFlags;

      try {
        harrassmentFlags = Object.keys(incidentDescription.harassmentFlags);
      } catch(err) {
        harrassmentFlags = Object.keys(incidentDescription.flags)
      }

      harrassmentFlags.forEach((flag) => {
        
        // if(incidentDescription.harassmentFlags[flag].length)
          flags += `${flag}, `;

      });

      return flags;
    }
    
    return (
      <Message 
        messageTitle={`${item._id}, filed on: ${new Date(incidentDescription.date).toDateString()}`}
        comment={renderFlags()}
        report={item}
        secondaryNavigation={this.props.secondaryNavigation}
      />
    );
  }

  render() {

    if(this.state.fetching)
      return (
        <ActivityIndicator 
          size="large"
        />
      );

    return (
      <>
        <View style={styles.filterWrapper}>
          <Chip 
            selected={this.state.filterByAll} 
            style={styles.filterCategoryChip} 
            onPress={this.filterReportsByAll}
            mode="outlined">
              All
          </Chip>
          <Chip 
            selected={this.state.filterBy7} 
            style={styles.filterCategoryChip} 
            onPress={this.filterReportsBy7}
            mode="outlined">
              Past 7 Days
          </Chip>
          <Chip 
            selected={this.state.filterBy14} 
            style={styles.filterCategoryChip} 
            onPress={this.filterReportsBy14}
            mode="outlined">
              Past 14 Days
          </Chip>
          <Chip 
            selected={this.state.filterBy30} 
            style={styles.filterCategoryChip} 
            onPress={this.filterReportsBy30}
            mode="outlined">
              Past 30 Days
          </Chip>
        </View>
        <Divider />
        <RecyclerListView 
          dataProvider={this.state.dataProvider}
          layoutProvider={this.layoutProvider}
          rowRenderer={this._rowRenderer}
        />
      </>
    );
  }

}

const styles = StyleSheet.create({
  avatarIcon: {
    textAlignVertical: "center",
    color: Theme.PrimaryColor
  },
  titleStyle: {
    fontFamily: Theme.OpenSansBold
  },
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
