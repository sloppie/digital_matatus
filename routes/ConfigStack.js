import React from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import {
  TextInput, 
  Card,
  Title,
  Divider,
  Searchbar
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { GTFSSearch } from '../utilities/GTFS_search'

import { APP_STORE } from '../';

export default class ConfigStack extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      results: []
    };

  }

  handleTextChange = async (route) => {
    const results = await new GTFSSearch("routes").indexSearch(route);

    this.setState({
      results
    });

  }

  renderResults = () => {
    const results = [];
    let id = 0;

    this.state.results.forEach(section => {

      if(section.results.length > 0) {
        results.push(<Title key={id.toString()}>{section.name}</Title>);
        id++;

        // section.results.forEach((result, index) => {
        let target = (section.results.length > 2) ? 2: section.results.length;

        for(let index=0; index<target; index++) {
          let result = section.results[index];

          results.push(
            <Card 
              style={styles.routeCard}
              key={id.toString()}
            >
              <Card.Title 
                left={props => <Icon name="bus" size={30}/>}
                title={result.matched} 
                subtitle={(section.name == "Route Short Name")? result.data.route_long_name: result.data.route_short_name}/>
            </Card>
          );
  
          id++;
          
          if(index != 1)
            results.push(<Divider key={id.toString()}/>)
      
          id++;

        }
  
      }

    });

    return results;
  }

  render() {

    return (
      <SafeAreaView style={styles.screen}>
        <Searchbar 
          style={styles.searchBar}
          placeholder="e.g: Route Number, Route Name, Know Drop off"
          onChangeText={this.handleTextChange}
        />
        <ScrollView>
          {this.renderResults()}
        </ScrollView>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    height: "100%"
  },
  routeCard: {
    marginEnd: 16,
    marginStart: 16,
    marginBottom: 8,
    backgroundColor: "white"
  },
  searchBar: {
    marginTop: 8,
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center"
  }
});