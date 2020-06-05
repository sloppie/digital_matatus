import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Card, Chip, Colors } from 'react-native-paper';
import Theme from '../../../theme';


export default class ReportCard extends React.PureComponent {

  constructor(props) {
    super(props);

    let incidentDescription = JSON.parse(this.props.data.incidentDescription);

    this.state = {
      incidentDescription: incidentDescription,
      culpritDescription: JSON.parse(this.props.data.culpritDescription),
      flags: Object.keys(incidentDescription.harassmentFlags),
    };
  }

  _viewReport = () => {
    this.props.navigation.navigate("ReportDetails", {
      report: this.props.data
    });
  }

  _renderHarassmentFlagChips = () => this.state.flags.map(flag => (
    <Chip style={styles.chip} icon="flag-triangle" >{flag}</Chip>
  ));

  render() {

    return (
      <Card
        onPress={this._viewReport}
        style={styles.reportCard}
      >
        <Card.Title 
          title={this.props.data._id}
          titleStyle={styles.cardTitle}
          subtitle={`Happened on: ${new Date(this.state.incidentDescription.date).toDateString()}`}
          subtitleStyle={styles.subtitle}
        />
        <Card.Content style={styles.chipContainer}>
          {this._renderHarassmentFlagChips()}
        </Card.Content>
      </Card>
    );
  }

}

const styles = StyleSheet.create({
  reportCard: {
    width: Dimensions.get("window").width - 32,
    alignSelf: "center",
    marginBottom: 8,
    backgroundColor: "#444",
  },
  cardTitle: {
    color: "white",
  },
  subtitle: {
    color: "white",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  chip: {
    alignSelf: "baseline",
    marginEnd: 4,
  },
});
