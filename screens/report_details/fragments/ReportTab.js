import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {} from 'react-native';
import {} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ReportDetailsTab from './ReportDetailsTab';
import MediaTab from './MediaTab';
import Theme from '../../../theme';

const Tab = createMaterialTopTabNavigator();


// report details icon
const ReportTabIcon = ({focused, color}) => (
  <Icon {...props} name="file" />
);

// media tab icon
const MediaTabIcon = (props) => (
  <Icon {...props} name="file" />
);


export default class Report extends React.PureComponent {

  _renderReportDetails = () =>  (
    <ReportDetailsTab 
      report={this.props.report}
    />
  );

  _renderMediaDetails = () => (
    <MediaTab 
      secondaryNavigation={this.props.secondaryNavigation}
      report={this.props.report}
    />
  );

  render() {

    return (
      <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: Theme.PrimaryColor,
          },
          activeTintColor: "white"
        }}
        swipeEnabled={false}
        screenOptions={{
        }}
      >
        <Tab.Screen 
          name="ReportDetails"
          component={this._renderReportDetails} 
          options={{
            tabBarIcon: <ReportTabIcon />,
          }}
        />
        <Tab.Screen 
          name="MediaTab"
          component={this._renderMediaDetails} 
          options={{
            tabBarIcon: <ReportTabIcon />,
          }}
        />
      </Tab.Navigator>
    );    
  }

}
