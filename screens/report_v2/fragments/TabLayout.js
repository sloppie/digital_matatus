import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { List } from 'react-native-paper';

// screens
import Chips from './Chips'; 
import IncidentDescription from './IncedentDescription';
import CulpritDescription from './CulpritDescription';
import PrivateInformation from './PrivateInformation';

const TopTab = createMaterialTopTabNavigator();

// creating a class allows eassier passing of props to children instead of using 
// the route.params approach to navigate, which will create a slightly more complex logic
export default class TabLayout extends React.PureComponent {
  
  _renderTabBar = () => null; // no tab bar

  _renderHarassmentDescriptionTab = (props) => (
    <>
      <Chips 
        {...props}
        ref={this.props.discriminationDescriptionRef}
        flags={this.props.lastFlags} 
        updateCurrentSetFlags={this.props.updateCurrentSetFlags}
        toggleFlag={this.props._toggleFlag}
        setDiscriminationCategory={this.props.setDiscriminationCategory}
        secondaryNavigation={this.props.secondaryNavigation}
      />
    </>
  );

  _renderMediaAttachmentTab = (props) => (
      <IncidentDescription
        {...props}
        ref={this.props.incidentDescriptionRef}
        updateCurrentSetFlags={this.props.updateCurrentSetFlags}
        culpritDescriptionRef={this.props.culpritDescriptionRef}
        getDiscriminationCategory={this.props.getDiscriminationCategory}
        secondaryNavigation={this.props.secondaryNavigation}
        showSnackBar={this.props.showSnackBar}
        setSnackBarAction={this.props.setSnackBarAction}
      />
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

  renderTabBarIcon = ({iconName}) => {
    return <List.Icon icon={iconName} color="black" />;
  }

  render() {

    return (
      <TopTab.Navigator
        tabBar={this._renderTabBar}
        backBehavior="initialRoute">
        <TopTab.Screen 
          name="IncidentDescription" 
          component={this._renderHarassmentDescriptionTab}
        />
        <TopTab.Screen 
          name="MediaAttachment" 
          component={this._renderMediaAttachmentTab}
        />
        <TopTab.Screen 
          name="CulpritDescription" 
          component={this._renderCulpritDescriptionTab}
        />
        <TopTab.Screen 
          name="PrivateInformation" 
          component={this._renderPrivateInformationTab}
        />
      </TopTab.Navigator>
    );
  }
}
