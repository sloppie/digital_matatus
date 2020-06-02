import React from 'react';
import { View, StyleSheet, ActivityIndicator, InteractionManager } from 'react-native';
import {Card, Chip, IconButton, Colors } from 'react-native-paper';


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
    this.props.toggleFlag(chipName);
    let {chips} = this.state;
    chips[chipName] = !chips[chipName];
    
    this.setState({chips});
  }

  _findDefinition = (chipName) => this.props.navigation.navigate("CategoryDefinition", {category: chipName});

  _allDefinitions = () => this.props.navigation.navigate("CategoryDefinition", {category: "all"});

  _renderChips = () => {
    let chips = [];
    
    for(let chipName in this.props.flags) {
      chips.push(
        <Chip 
          style={styles.chip}
          selected={this.state.chips[chipName]}
          onPress={this._toggleChip.bind(this, chipName)}
          onLongPress={this._findDefinition.bind(this, chipName)}
          key={chipName}
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
          subtitle="Press on a category to select(Long press on a category to learn more)"
          subtitleNumberOfLines={2}
        />
        <Card.Content style={styles.cardContent}>
          <View style={styles.chipContainer}>
            {
              (this.state.loading) 
              ? <ActivityIndicator size="large" style={styles.activityIndicator}/>
              : this._renderChips()
            }
          </View>
          <IconButton 
            icon="information-outline" 
            style={styles.moreInfoIcon} 
            color={Colors.blue500}
            onPress={this._allDefinitions}
          />
        </Card.Content>
      </Card>
    );
  }

}

const styles = StyleSheet.create({
  card: {
    elevation: 0,
  },
  cardContent: {
    paddingBottom: 0,
    marginBottom: 0,
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
  },
  moreInfoIcon: {
    alignSelf: "flex-end",
  },
});
