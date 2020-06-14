import React from 'react';
import { Dimensions, ActivityIndicator, StyleSheet, ToastAndroid } from 'react-native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { DataProvider, RecyclerListView, LayoutProvider } from 'recyclerlistview';

import Theme from '../../../theme';
import { API } from '../../../utilities';

const SCREEN_WIDTH = Dimensions.get("window").width;


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


export default class LargeRatingsList extends React.PureComponent {

  constructor(props) {
    super(props);

    this.dataProvider = new DataProvider((r1, r2) => r1 !== r2);

    this.state = {
      dataProvider: [],
      fetching: true,
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

  _setReports = (reports) => {
    // clone new rows
    this.setState({
      dataProvider: this.dataProvider.cloneWithRows(reports),
      fetching: false,
    });

    this.forceUpdate();
  }

  _rowRenderer = (type, item) => {
    let incidentDescription = JSON.parse(item.incidentDescription);

    const renderFlags = () => {
      let flags = "Flags: ";
      Object.keys(incidentDescription.harassmentFlags).forEach((flag) => {
        
        if(incidentDescription.harassmentFlags[flag].length)
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
      <RecyclerListView 
        dataProvider={this.state.dataProvider}
        layoutProvider={this.layoutProvider}
        rowRenderer={this._rowRenderer}
      />
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
});
