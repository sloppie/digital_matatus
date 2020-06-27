import React from 'react';
import { ToastAndroid, StyleSheet, FlatList, Dimensions } from 'react-native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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


export default class RatingsList extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      reports: []
    };

  }

  componentDidMount() {
    API.fetchReportsByRoute(
      this.props.route.route_id,
      this._setReports,
      this._setReports.bind(this, [])
    );
  }

  _setReports = (reports) => this.setState({reports});

  _renderComments = () => {
    let comments = [];

    let messages = [
      "I am generally happy with you",
      "This is a simple I am angry message",
      "This is a simple you dont know what i am saying message",
      "Do you four even",
      "New Five, Who dis?",
    ];

    let titles = [
      "Happy Message",
      "Neutral Message",
      "IDK Message",
      "Message Four",
      "Five Message",
    ];

    for(let i=0; i<5; i++) {
      comments.push(
        <Message 
          messageTitle={titles[i]}
          comment={messages[i]}
          key={`${i}`}
        />
      );
    }

    return comments;
  }

  _renderItem = ({item}) => {
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

  _keyExtractor = (item) => item._id;

  render() {

    // const length = Dimensions.get("window").width;

    return (
      <FlatList 
        data={this.state.reports}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        maxToRenderPerBatch={10}
        getItemLayout={(data, index) => {return {length: 77, offset: (77 * index), index}}}
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