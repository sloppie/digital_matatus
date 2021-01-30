import React from 'react';
import { ToastAndroid, StyleSheet, FlatList, Dimensions } from 'react-native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Filters from './Filters';
import Theme from '../../../theme';
import { API } from '../../../utilities';

class Message extends React.Component {

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
          left={props => <Icon {...props} name="file" color="purple" size={30} style={styles.avatarIcon}/>}
          title={this.props.messageTitle}
          titleStyle={styles.titleStyle}
          description={this.props.comment}
          onPress={this._viewReport}
        />
        
      </>
    );
  }

}


export default class RatingsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      reports: [],
    };

  }

  _setReports = (reports) => this.setState({reports});

  _renderItem = ({item}) => {

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

  _keyExtractor = (item) => item._id;

  render() {

    return (
      <>
        <Filters filterReportsByCategories={this.props.filterReportsByCategories} />
        <FlatList 
          data={this.state.reports}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          maxToRenderPerBatch={10}
          getItemLayout={(data, index) => {return {length: 77, offset: (77 * index), index}}}
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
});