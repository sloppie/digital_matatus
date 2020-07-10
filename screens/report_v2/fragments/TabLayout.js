import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// self defined
import Chips from './Chips'; 
import IncidentDescription from './IncedentDescription';
import CulpritDescription from './CulpritDescription';
import PrivateInformation from './PrivateInformation';

const TopTab = createMaterialTopTabNavigator();

// creating a class allows eassier passing of props to children instead of using 
// the route.params approach to navigate, which will create a slightly more complex logic
export default class TabLayout extends React.PureComponent {
  
  // do  not want to render a TabBar for this scenario
  _renderTabBar = () => null;

  _renderHarassmentDescriptionTab = (props) => (
    <>
      <Chips 
        flags={this.props.lastFlags} 
        toggleFlag={this.props._toggleFlag}
        secondaryNavigation={this.props.secondaryNavigation}
      />
      <IncidentDescription
        {...props}
        ref={this.props.incidentDescriptionRef}
        culpritDescriptionRef={this.props.culpritDescriptionRef}
        secondaryNavigation={this.props.secondaryNavigation}
      />
    </>
  );

  _renderCulpritDescriptionTab = (props) => (
    <CulpritDescription 
      {...props}
      ref={this.props.culpritDescriptionRef}
      secondaryNavigation={this.props.secondaryNavigation}
    />
  );

  _renderPrivateInformationTab = (props) => (
    <PrivateInformation 
      {...props}
      ref={this.props.privateInformationRef}
      secondaryNavigation={this.props.secondaryNavigation}
      _getInformation={this.props._getInformation}
      _sendVerifiedData={this.props._sendVerifiedData}
    />
  );

  render() {

    return (
      <TopTab.Navigator
        tabBar={this._renderTabBar}
        backBehavior="initialRoute"
      >
        <TopTab.Screen 
          name="IncidentDescription" 
          component={this._renderHarassmentDescriptionTab}
        />
        <TopTab.Screen 
          name="CulpritDescription" 
          component={this._renderCulpritDescriptionTab}
        />
        {/**
         * This private information screen will be a double screen that will house both private info addition,
         * and the data verification segment
         */}
        <TopTab.Screen 
          name="PrivateInformation" 
          component={this._renderPrivateInformationTab}
        />
        {/* <TopTab.Screen 
          name="DataVerification" 
          secondaryNavigation={this.props.secondaryNavigation}
        /> */}
      </TopTab.Navigator>
    );
  }
}
