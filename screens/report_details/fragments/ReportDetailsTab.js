import React from 'react';
import { ScrollView, SafeAreaView, StyleSheet, View } from 'react-native';
import { Title, Chip, Colors, List, Paragraph, Divider, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// user defined
import { ReportParser } from '../../../utilities';


export default class ReportDetailsTab extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      report: new ReportParser(this.props.report),
    };
  }

  _renderHarassmentFlags = () => {
    let harassmentFlags = this.state.report.getHarassmentFlags();

    let flags = Object.keys(harassmentFlags).map(type => (
      <List.Accordion 
        title={type}
        key={type}>
        {
          harassmentFlags[type].map((desc, index) => (
            <List.Item 
              style={styles.flag}
              left={props => <Icon {...props} style={styles.leftIcon} name="flag-triangle" size={30} color={Colors.red500}/>}
              title={desc}
              titleNumberOfLines={3}
              key={index.toString()}
            />
          ))
        }
      </List.Accordion>
    ));

    return flags;
  }

  render() {

    return (
      <ScrollView style={styles.screen}>
        <View style={styles.chipContainer}>
          <Chip 
            style={styles.chip} 
            textStyle={styles.chipText}
            mode="outlined">#{this.state.report._id}</Chip>
          <Chip 
            style={styles.chip} 
            textStyle={styles.chipText}
            mode="outlined">#RT{this.state.report.route_short_name}</Chip>
        </View>
        <Title style={styles.reportTitle}>{this.state.report.generateReportTitle()}</Title>
        <List.Section title="Description" />
        <Paragraph style={styles.description}>{this.state.report.generateReportMessage()}</Paragraph>
        <Divider />
        <List.Section title="Harassment Flags" />
        {this._renderHarassmentFlags()}
        <Divider />
        <List.Section title="Location" />
        <Card.Title 
          left={props => <Icon {...props} name="map-marker" color={Colors.red500} />}
          title={this.state.report.getLocation()}
          subtitle={this.state.report.getLocation()}
        />
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: "100%",
    width: "100%",
  },
  chipContainer: {
    paddingTop: 8,
    paddingStart: 16,
    flexDirection: "row"
  },
  chip: {
    alignSelf: "flex-start",
    marginEnd: 8,
  },
  chipText: {
    fontSize: 16,
    color: Colors.blue800,
  },
  reportTitle: {
    paddingStart: 16,
  },
  description: {
    paddingStart: 16,
    paddingEnd: 16,
    marginBottom: 16,
  },
  flag: {
    marginStart: 16,
    marginEnd: 16,
  },
  leftIcon: {
    alignSelf: "center"
  },
});
