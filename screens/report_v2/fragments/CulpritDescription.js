import React from 'react';
import { ScrollView, View, Dimensions, StyleSheet, Text } from 'react-native';
import { Card, TextInput, RadioButton, List, Divider, Colors, Caption } from 'react-native-paper';
import Theme from '../../../theme';

let GTFSSearch = null;

const LOCATIONS = Object.freeze({
  "BUS_TERMINAL": "Bus Terminal",
  "ON_BUS_ENTRANCE": "On the Bus Entrance",
  "INSIDE_BUS": "Inside the bus"
});

export default class CulpritDescription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      routeSearchFocused: false, // this helps to know when to render the search results for route
      saccoName: "",
      routeName: "",
      routeID: "",
      culpritDescription: "",
      location: "",
      routeSearchInFocus: false,
      results: [],
      routeDetails: null,
      culpritType: "",
    };
  }

  // this function is used by the Incident Description to set the location type
  _setLocation = (location) => this.setState({location: LOCATIONS[location]});

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
        key={"16062"}
      />
    );

    for(let i=0; i< target; i++) {
      routes.push(
        <List.Item 
          left={props => <List.Icon {...props} icon="bus" color="black" style={styles.routeSuggestionsLeft} />}
          title={results[i].data.route_short_name}
          description={results[i].data.route_long_name}
          key={i.toString()}
          onPress={this._setRoute.bind(this, results[i].data)}
        />
      );
    }

    return <View style={styles.suggestionContainer}>{routes}</View>;
  }

  _setRoute = (routeDetails) => {
    this.setState({routeSearchFocused: false, routeDetails, routeID: routeDetails});
  }

  _setCulpritType = (culpritType) => this.setState({culpritType});

  _toggleSuggestion = (routeSearchFocused) => this.setState({routeSearchFocused});

  _turnOffRouteSuggestions = () => this.setState({routeSearchFocused: false});

  // information to be got:
  // saccoName
  // routeID
  // culpritType
  _getInformation = () => {
    let {saccoName, location, routeName, routeID, culpritType} = this.state;
    console.log(`CulpritType: ${culpritType}`)

    let response = {
      saccoName: (location != LOCATIONS.INSIDE_BUS) ? "ALL": saccoName,
      // routeName,
      routeID: routeID.route_id,
      culpritType
    };

    return response;
  }

  render() {

    return (
      <ScrollView style={styles.descriprionContainer}>
        {/**
         * This part will be used to check for the location type
         */}
        {/* <Card.Title 
          title="Perpetrator Description"
          titleStyle={styles.title}
          subtitle="(This section can be skipped over)Please enter a small description of the culprit"
          subtitleNumberOfLines={3}
        /> */}
        <View style={styles.marginStart}>
          <Text style={styles.screenTitle}>Perpetrator Description</Text>
          <Caption style={{marginEnd: 16,}}>
            (This section can be skipped over)Please enter a small description of the culprit
          </Caption>
        </View>
        <Divider />
        <Card.Title 
          title={this.state.location}
          subtitle={`incident happened in ${this.state.location}`}
        />
        {
          (this.state.location != LOCATIONS.INSIDE_BUS) && (
            <List.Item 
              title="All saccos culpable" 
              description="Incident did not happen inside any one specific bus" 
              left={props => <RadioButton value="All" status="checked" color="purple" />}
            />
          )
        }
        {
          this.state.location === LOCATIONS.INSIDE_BUS && (
            <TextInput
              value={this.state.saccoName}
              style={styles.textInput}
              placeholder="Enter the sacco name"
              onChangeText={this._handleSaccoName}
              mode="outlined"
              label="Sacco Name"
            />
          )
        }
        <Divider />
        {
          (this.state.routeDetails == null) && (
            <TextInput
              value={this.state.routeName}
              style={styles.textInput}
              placeholder="Enter the route no, or a destination you are familiar with on the route"
              onChangeText={this._handleRouteName}
              onFocus={this._toggleSuggestion.bind(this, true)}
              mode="outlined"
              label="Route Name"
            theme={{colors: {primary:Theme.PrimaryColor, accent: Colors.red200, text: Colors.red200}}}
            />
          )
        }
        {
          this.state.routeDetails && <List.Section
              title="Route of incident"
            >
              <List.Item 
                left={props => (
                  <List.Icon 
                    {...props}
                    icon="bus"
                    color="black"
                    style={styles.routeDetailsCardLeft} />
                )}
                title={this.state.routeDetails.route_short_name}
                titleStyle={styles.routeDetailsCardTitle}
                description={this.state.routeDetails.route_long_name}
                style={styles.routeDetailsCard}
              />
            </List.Section>
        }
        {(this.state.routeSearchFocused) && this._renderRouteSuggestions()}
        <Divider />
        <RadioButton.Group
          onValueChange={this._setCulpritType}
          value={this.state.culpritType}
        >
          <List.Section
            title="Perpetrator description"
          >
            <List.Item 
              left={props => <RadioButton {...props} color="purple" value="Driver" onPress={this._setCulpritType}/>}
              title="Driver"
              description="Action was carried out by a matatu driver"
              onPress={this._setCulpritType.bind(this, "Driver")}
            />
            <List.Item 
              left={props => <RadioButton {...props} value="Conductor" onPress={this._setCulpritType}/>}
              title="Conductor"
              description="Action was carried out by a matatu conductor"
              onPress={this._setCulpritType.bind(this, "Conductor")}
            />
            <List.Item 
              left={props => <RadioButton {...props} color="purple" value="Route handler" onPress={this._setCulpritType}/>}
              title="Route Handler"
              description="Action was carried out by a matatu driver"
              onPress={this._setCulpritType.bind(this, "Route handler")}
            />
            <List.Item 
              left={props => <RadioButton {...props} color="purple" value="other" onPress={this._setCulpritType}/>}
              title="Pedestrian"
              description="Action was carried out by a pedestrian"
              onPress={this._setCulpritType.bind(this, "Pedestrian")}
            />
            <List.Item 
              left={props => <RadioButton {...props} color="purple" value="other" onPress={this._setCulpritType}/>}
              title="other"
              description="Action was carried out by another party not explicitly described above"
              onPress={this._setCulpritType.bind(this, "other")}
            />
          </List.Section>
        </RadioButton.Group>
        {/* <TextInput
          value={this.state.culpritDescription}
          style={styles.textInput}
          placeholder="Enter a short description, i.e NickName,"
          onChangeText={this._handleCulpritDescription}
          mode="outlined"
          label="Description"
          multiline={true}
        /> */}
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  descriprionContainer: {
    width: Dimensions.get("window").width,
  },
  marginStart: {marginStart: 16,},
  screenTitle: {
    fontSize: 40,
    fontFamily: Theme.OpenSansBold,
  },
  title: {},
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 8,
  },
  routeDetailsCard: {
    backgroundColor: "pink",
    elevation: 2,
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    borderRadius: 8,
  },
  routeDetailsCardLeft: {
    borderWidth: 2,
    borderColor: "purple",
    borderRadius: 24,
    backgroundColor: "white",
  },
  routeDetailsCardTitle: {
    color: "purple",
  },
  suggestionContainer: {
    alignSelf: "center",
    width: (Dimensions.get("window").width - 32),
  },
  routeSuggestionsLeft: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "purple",
  },
});
