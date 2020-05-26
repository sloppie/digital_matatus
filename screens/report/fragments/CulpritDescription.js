import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Card, TextInput, RadioButton, List } from 'react-native-paper';

let GTFSSearch = null;

export default class CulpritDescription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      routeSearchFocused: false, // this helps to know when to render the search results for route
      saccoName: "",
      routeName: "",
      culpritDescription: "",
      location: "",
      routeSearchInFocus: false,
      results: []
    };
  }

  // this function is used by the Incident Description to set the location type
  _setLocation = (location) => this.setState({location});

  // handle sacco name
  _handleSaccoName = (saccoName) => this.setState({saccoName});

  // handle route name
  _handleRouteName = (routeName) => {
    this.setState({routeName});

    // update suggestion results
    this.updateSearch(routeName);
  }

  // culprit description
  _handleCulpritDescription = (culpritDescription) => this.setState({culpritDescription});

  async updateSearch(searchEntry) {

    if(GTFSSearch == null) {
      let module = require('../../../utilities').GTFSSearch;
      GTFSSearch = new module("routes");
    }

    let results = await GTFSSearch.searchSpecific("Route Long Name", searchEntry);


    if(searchEntry == this.state.routeName) {
      this.setState({results});
    }

  }

  // this method helps the user type out the route in point to help those who are not aware of route names
  _renderRouteSuggestions = () => {
    let routes = [];

    let results = this.state.results;

    if(results == [] || this.state.routeName == "")
      return [];

    let target = (results.length > 5)? 5: results.length;
    routes.push(
      <List.Section 
        title="Route suggestions"
      />
    );

    for(let i=0; i< target; i++) {
    console.log(results[i].data);
      routes.push(
        <List.Item 
          left={props => <List.Icon {...props} icon="bus" />}
          title={results[i].data.route_short_name}
          description={results[i].data.route_long_name}
          key={i.toString()}
        />
      );
    }

    return <View style={styles.suggestionContainer}>{routes}</View>;
  }

  _toggleSuggestion = routeSearchFocused => this.setState({routeSearchFocused});

  _turnOffRouteSuggestions = () => this.setState({routeSearchFocused: false});

  render() {

    return (
      <View style={styles.descriprionContainer}>
        {/**
         * This part will be used to check for the location type
         */}
        <Card.Title 
          title="Culprit Description"
          titleStyle={styles.title}
          subtitle="(This section can be skipped over)Please enter a small description of the culprit"
          subtitleNumberOfLines={3}
        />
        <TextInput
          value={this.state.saccoName}
          style={styles.textInput}
          placeholder="Enter the sacco name"
          onChangeText={this._handleSaccoName}
          mode="outlined"
          label="Sacco Name"
        />
        <TextInput
          value={this.state.routeName}
          style={styles.textInput}
          placeholder="Enter the route no, or a destination you are familiar with on the route"
          onChangeText={this._handleRouteName}
          onFocus={this._toggleSuggestion.bind(this, true)}
          mode="outlined"
          label="Route Name"
        />
        {(this.state.routeSearchFocused)? this._renderRouteSuggestions(): null}
        <TextInput
          value={this.state.culpritDescription}
          style={styles.textInput}
          placeholder="Enter a short description, i.e NickName,"
          onChangeText={this._handleCulpritDescription}
          mode="outlined"
          label="Description"
          multiline={true}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  descriprionContainer: {
    width: Dimensions.get("window").width,
  },
  title: {},
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
  },
  suggestionContainer: {
    alignSelf: "center",
    width: (Dimensions.get("window").width - 32),
  },
});
