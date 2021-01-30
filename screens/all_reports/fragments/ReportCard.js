import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Chip, Colors, Paragraph, Caption, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../../theme';
import ReportParser from '../../../utilities/report_parser';


export default class ReportCard extends React.Component {

  constructor(props) {
    super(props);

    let incidentDescription = JSON.parse(this.props.data.incidentDescription);
    let flags;
    try {
      flags = Object.keys(incidentDescription.harassmentFlags);
    } catch(err) {
      flags = Object.keys(incidentDescription.flags);
    }

    this.state = {
      report: new ReportParser(this.props.data),
      incidentDescription,
      culpritDescription: JSON.parse(this.props.data.culpritDescription),
      flags,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  _viewReport = () => {
    this.props.navigation.navigate("ReportDetails", {
      report: this.props.data
    });
  }

  _renderHarassmentFlagChips = () => this.state.flags.map(flag => (
    <Chip 
      key={flag}
      style={styles.chip} 
      selectedColor="purple"
      mode="outlined"
      icon="flag-triangle" >
        {flag}
    </Chip>
  ));

  _renderMediaIcons = () => {
    let icons = [];

    if(this.state.report.hasMedia()) {

      if(this.state.report.hasPhotos())
        icons.push(
          <Icon 
            name="camera"
            size={30}
            key="icon_1"
          />
        );

      if(this.state.report.hasVideos())
        icons.push(
          <Icon 
            name="video"
            size="30"
            key="icon_2"
          />
        );
      if(this.state.report.hasAudios())
        icons.push(
          <Icon 
            name="record"
            size="30"
            key="icon_3"
          />
        );

    } else {
      return (
        <Icon 
          name="close"
          size={30}
        />
      );
    }

  }

  render() {

    const showSize = ({nativeEvent}) => console.log(JSON.stringify(nativeEvent, null, 2));

    return (
      <Card
        onPress={this._viewReport}
        style={styles.reportCard}
      >
        <Card.Title 
          style={{marginTop: 0, paddingTop: 0,}}
          title={this.state.report.generateReportTitle()}
          titleStyle={styles.cardTitle}
          subtitle={`Reported on: ${this.state.report.date}`}
          subtitleStyle={styles.subtitle}
        />
        <Card.Content>
          {/* <Paragraph>{this.state.report.generateReportMessage()}</Paragraph> */}
          <View style={styles.chipContainer}>
            {this._renderHarassmentFlagChips()}
          </View>
          {/* <View style={styles.attachedMedia}>
            {this._renderMediaIcons()}
          </View> */}
        </Card.Content>
        {/* <Divider style={styles.divider} /> */}
        <Caption style={{marginStart: 16, marginBottom: 8}}>ID: {this.state.report._id}</Caption>
      </Card>
    );
  }

}

const styles = StyleSheet.create({
  reportCard: {
    width: Dimensions.get("window").width - 32,
    alignSelf: "center",
    marginBottom: 8,
    // backgroundColor: "#444",
  },
  cardTitle: {
    // color: "white",
    fontFamily: Theme.OpenSansBold,
    margin: 0,
    padding: 0,
  },
  subtitle: {
    // color: "white",
  },
  divider: {
    marginTop: 4,
  },
  chipContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  chip: {
    alignSelf: "baseline",
    marginEnd: 4,
  },
  attachedMedia: {
    flexDirection: "row",
    alignContent: "center",
  },
});
