import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Chip, Colors, Paragraph, Caption, Divider } from 'react-native-paper';
import Theme from '../../../theme';
import ReportParser from '../../../utilities/report_parser';


export default class ReportCard extends React.Component {

  constructor(props) {
    super(props);

    let incidentDescription = JSON.parse(this.props.data.incidentDescription);

    this.state = {
      report: new ReportParser(this.props.data),
      incidentDescription: incidentDescription,
      culpritDescription: JSON.parse(this.props.data.culpritDescription),
      flags: Object.keys(incidentDescription.harassmentFlags),
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
      icon="flag-triangle" >
        {flag}
    </Chip>
  ));

  render() {

    return (
      <Card
        onPress={this._viewReport}
        style={styles.reportCard}
        renderToHardwareTextureAndroid={true}
      >
        <Card.Title 
          title={this.state.report.generateReportTitle()}
          titleStyle={styles.cardTitle}
          subtitle={`Reported on: ${this.state.report.date}`}
          subtitleStyle={styles.subtitle}
        />
        <Card.Content>
          <Paragraph>{this.state.report.generateReportMessage()}</Paragraph>
          <View style={styles.chipContainer}>
            {this._renderHarassmentFlagChips()}
          </View>
          <Caption>Report ID: {this.state.report._id}</Caption>
        </Card.Content>
        {/* <Divider style={styles.divider} /> */}
      </Card>
    );
  }

}

const styles = StyleSheet.create({
  reportCard: {
    // width: Dimensions.get("window").width - 32,
    alignSelf: "center",
    // marginBottom: 8,
    // backgroundColor: "#444",
    borderBottomWidth: 1,
    borderColor: "#999",
    borderStyle: "dotted",
  },
  cardTitle: {
    // color: "white",
    fontFamily: Theme.OpenSansBold
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
});
