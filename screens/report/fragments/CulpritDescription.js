import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Card, TextInput } from 'react-native-paper';

let GTFSSearch = null;

export default class CulpritDescription extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      routeSearchFocused: false, // this helps to know when to render the search results for route
      saccoName: "",
      routeName: "",
      culpritDescription: "",
    };
  }

  // handle sacco name
  _handleSaccoName = (saccoName) => this.setState({saccoName});

  // handle route name
  _handleRouteName = (routeName) => this.setState({routeName});

  // culprit description
  _handleCulpritDescription = (culpritDescription) => this.setState({culpritDescription});

  // this method helps the user type out the route in point to help those who are not aware of route names
  _renderRouteSuggestions = () => {
    let routes = [];

    if(!GTFSSearch) // load the GTFSSearch module if it is not present (lazy loading)
      GTFSSearch = require("../../../utilities").GTFSSearch;

    let search = new GTFSSearch("routes");
    
    return routes;
  }

  _turnOffRouteSuggestions = () => this.setState({routeSearchFocused: false});

  render() {

    return (
      <View style={styles.descriprionContainer}>
        <Card.Title 
          title="Culprit Description"
          titleStyle={styles.title}
          subtitle="(This section can be skipped over)Please enter a small description of the culprit"
          subtitleNumberOfLines={3}
        />
        <TextInput
          value={this.state.description}
          style={styles.textInput}
          placeholder="Enter the sacco name"
          onChange={this._handleSaccoName}
          mode="outlined"
          label="Sacco Name"
        />
        <TextInput
          value={this.state.description}
          style={styles.textInput}
          placeholder="Enter the route no, or a destination you are familiar with on the route"
          onChange={this._handleRouteName}
          mode="outlined"
          label="Sacco Name"
        />
        {(this.state.routeSearchFocused)? this.renderRouteSuggestions(): <View/>}
        <TextInput
          value={this.state.description}
          style={styles.textInput}
          placeholder="Enter a short description, i.e NickName,"
          onChange={this._handleCulpritDescription}
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
});
