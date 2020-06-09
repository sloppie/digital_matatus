import React from 'react';
import {} from 'react-native';
import {} from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; 
import RatingsList from './RatingsList';
import LargeRatingsList from './LargeRatingsList';
import SaccoList from './SaccoList';
import StopsList from './StopsList';
import LargeStopList from './LargeStopList';
import Stats from './Stats';

const Tab = createMaterialTopTabNavigator();


class DetailsTab extends React.PureComponent {

  _renderRatingsList = () => (
    <RatingsList 
      secondaryNavigation={this.props.secondaryNavigation}
      route={this.props.route}
    />
  );

  _renderLargeRatingsList = () => (
    <LargeRatingsList 
      secondaryNavigation={this.props.secondaryNavigation}
      route={this.props.route}
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
      route={this.props.route}
    />
  )

  render() {
    return (
      <Tab.Navigator
        lazy={true}
      >
        <Tab.Screen 
          name="RatingsList"
          component={this._renderLargeRatingsList}
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

export default DetailsTab;
