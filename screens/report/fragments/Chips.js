import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {Card, Chip } from 'react-native-paper';


export default class Chips extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      chips: {},
    };

  }

  componentDidMount() {
    this.setState({chips: this.props.flags, loading: false});
  }

  _toggleChip = (chipName) => {
    let {chips} = this.state;
    chips[chipName] = !chips[chipName];

    this.setState({chips});

    this.props.toggleFlag(chipName);
  }

  _renderChips = () => {
    let chips = [];
    
    for(let chipName in this.props.flags) {
      chips.push(
        <Chip 
          style={styles.chip}
          selected={this.state.chips[chipName]}
          onPress={this._toggleChip.bind(this, chipName)}
        >
          {chipName}
        </Chip>
      );
    }

    return chips;
  }

  render() {

    return (
      <Card style={styles.card}>
        <Card.Title 
          title="Harassment Categories"
          subtitle="Press on a category to select\\nLong press on a category to learn more."
          subtitleNumberOfLines={2}
        />
        <Card.Content style={styles.chipContainer}>
          {
            (this.state.loading) 
            ? <ActivityIndicator size="large" style={styles.activityIndicator}/>
            : this._renderChips()
          }
        </Card.Content>
      </Card>
    );
  }

}

const styles = StyleSheet.create({
  card: {
    elevation: 0,
  },
  chipContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    marginEnd: 8,
    marginBottom: 8,
  }
});
