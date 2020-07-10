import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {} from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; 
import RatingsList from './RatingsList';
import LargeRatingsList from './LargeRatingsList';
import SaccoList from './SaccoList';
import StopsList from './StopsList';
import LargeStopList from './LargeStopList';
import Stats from './Stats';

const Tab = createMaterialTopTabNavigator();


export default class DetailsTab extends React.PureComponent {

  _renderRatingsList = () => (
    <RatingsList 
      secondaryNavigation={this.props.secondaryNavigation}
      route={this.props.route}
      reports={this.props.reports}
      filterReportsByCategories={this.props.filterReportsByCategories}
      ref={this.props.ratingsListRef}
    />
  );

  _renderLargeRatingsList = () => (
    <LargeRatingsList 
      secondaryNavigation={this.props.secondaryNavigation}
      route={this.props.route}
      reports={this.props.reports}
      filterReportsByCategories={this.props.filterReportsByCategories}
    />
  );

  _renderSaccoList = () => (
    <SaccoList 
      secondaryNavigation={this.props.secondaryNavigation}
    />
  );

  _renderStopsList = () => (
    <StopsList 
      secondaryNavigation={this.props.secondaryNavigation}
      data={this.props.data}
      listItemAction={this.props.listItemAction}
    />
  );

  _renderLargeStopsList = () => (
    <LargeStopList 
      secondaryNavigation={this.props.secondaryNavigation}
      data={this.props.data}
      listItemAction={this.props.listItemAction}
    />
  );

  _renderStats = () => (
    <Stats 
      ref={this.props.statsRef}
      route={this.props.route}
      reports={this.props.reports}
      getParentFilters={this.props.getParentFilters}
    />
  )

  render() {

    return (
      <Tab.Navigator
        lazy={true}
        backBehavior="initialRoute" /*Prevent weird back behaviour */
      >
        <Tab.Screen 
          name="RatingsList"
          component={this._renderRatingsList}
        />
        {/* Uses RecyclerListView */}
        <Tab.Screen 
          name="StopsList"
          component={this._renderLargeStopsList}
        />
        <Tab.Screen 
          name="Stats"
          component={this._renderStats}
        />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  tabNavigator: {
    height: Math.floor(Dimensions.get("window").width * 0.6),
  },
});
