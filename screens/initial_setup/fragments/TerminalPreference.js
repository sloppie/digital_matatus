import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import {
  Card,
  Title,
  Divider,
  Searchbar,
  TouchableRipple,
  Snackbar
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { GTFSSearch } from '../../../utilities/GTFS_search'

import { APP_STORE } from '../../../';

import Theme from '../../../theme';

import AsyncStorage from '@react-native-community/async-storage';
import { CONFIG_COMPLETE } from '../../../store';

const ROUTES = require('../../../GTFS_FEED/routes/routes.json');

export default class ConfigStack extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      searchEntry: "",
      results: [],
      expanded: -1,
      likedRoutes: [],
      unhearted: false //helps keep tab of the Snackbar
    };

  }

  componentDidMount() {
    // subscribe to the CONFIG_COMPLETE to help store the stored values before rerouting
    // also store the componentID to help make sure there is unsubscription after successful
    // posting of the favourites
    this.componentID = APP_STORE.subscribe(CONFIG_COMPLETE, this.postFavourites.bind(this));
  }

  handleTextChange = async (route) => {
    this.setState({
      searchEntry: route
    });

    this.updateState(route);
    
  }
  
  updateState(searchEntry) {

    if(!searchEntry) {
      this.setState({
        results: []
      });

      return;
    }

    new GTFSSearch("routes")
      .indexSearch(searchEntry)
      .then(response => {
        
        if(this.state.searchEntry == searchEntry)
          this.setState({
            results: response, // sets to the new results
            expanded: -1 // resets the expanded column
          });

      }).catch((err) => {
        this.setState({
          results: [],
          expanded: -1
        });
      });

    
  }

  toggleRoute(routeId, liked) {
    
    let likedRoutes:Array = [];

    if(this.state.likedRoutes.length > 0) {
      // if you don not use the spread operator it is passed by reference and not by value
      likedRoutes = [...this.state.likedRoutes[this.state.likedRoutes.length - 1]];
    }

    if(liked) {
      console.log(likedRoutes)
      likedRoutes.splice(likedRoutes.indexOf(routeId), 1);
      console.log(likedRoutes)
      this.setState({
        likedRoutes: [...this.state.likedRoutes, likedRoutes],
        unhearted: true
      });
    } else {
      likedRoutes.push(routeId);
      this.setState({
        likedRoutes: [...this.state.likedRoutes, likedRoutes]
      });
    }

  }

  showMore(section, sectionIndex) {
    this.setState({
      expanded: sectionIndex
    });
  }

  renderResults = () => {
    const results = [];
    let id = 0;

    if(this.state.results.length == 0)
      return <View />

    this.state.results.forEach((section, sectionIndex) => {

      if(section.results.length > 0) {
        results.push(<Title style={styles.sectionTitle} key={id.toString()}>{section.name}</Title>);
        id++;

        let target = (section.results.length > 2 && this.state.expanded != sectionIndex) ? 2: section.results.length;

        for(let index=0; index<target; index++) {
          let result = section.results[index];
          let liked = (this.state.likedRoutes.length > 0)?
            this.state.likedRoutes[(this.state.likedRoutes.length - 1)].indexOf(result.data.route_id) != -1
            : false; // initialised to 0 if the likedRoutes are 0

          results.push(
            <Card 
              style={[styles.routeCard, styles.cardTitle]}
              key={id.toString()}
            >
              <Card.Title 
                left={props => <Icon name="bus" size={30}/>}
                title={result.matched} 
                subtitle={
                  (section.name == "Route Short Name")? 
                    result.data.route_long_name
                    : result.data.route_short_name
                }
                right={props=> 
                  <TouchableRipple
                    onPress={this.toggleRoute.bind(this, result.data.route_id, liked)}
                  >
                    <Icon {...props} name={(liked)? "heart":"heart-outline"}  style={{marginLeft: 8, marginRight: 16}}/>
                  </TouchableRipple>
                }
              />
            </Card>
          );
  
          id++;
          

          
        }
        
        if(this.state.expanded != sectionIndex) {
          if(section.results.length > 2)
            results.push(
              <TouchableRipple
                onPress={this.showMore.bind(this, section, sectionIndex)}
                style={{ paddingBottom: 4}}
                key={id.toString()}
              >
                <Text style={styles.expandList}>View more results<Icon name="chevron-down" /></Text>
              </TouchableRipple>
            );
        } else {
          results.push(
            <TouchableRipple
              onPress={this.showMore.bind(this, section, -1)}
              style={{ paddingBottom: 4}}
              key={id.toString()}
            >
              <Text style={styles.expandList}>Show less<Icon name="chevron-up"/></Text>
            </TouchableRipple>
          );

        }
          
        id++;
          
        if((sectionIndex + 1) != this.state.results.length)
          results.push(<Divider style={{marginBottom: 4}} key={id.toString()}/>)
      
        id++;
      }

    });

    return results;
  }

  dismissedSnackbar = () => this.setState({unhearted: false});
  
  _undoLastUnheart = () => {
    let { likedRoutes } = this.state;
    likedRoutes.pop(); // undo last saved action

    this.setState({
      likedRoutes: [...likedRoutes]
    });

  }

  postFavourites = async () => {
    let routes = [];

    this.state.likedRoutes.forEach(route_id => {
      routes.push(ROUTES[route_id]);
    });

    // AsyncStorage.setItem("favourite_routes", JSON.stringify(routes), (err) => {
    //   if(err)
    //     console.log("an error ocurred while trying to store data");
    //   else {
    //     console.log("stored:\n" + JSON.stringify(routes, null, 2))
    //     // unsubscribe from the CONFIG_COMPLETE event using the componentID assigned during subscription.
    //     APP_STORE.unsubscribe(CONFIG_COMPLETE, this.componentID);
    //   }
    // });

    APP_STORE.unsubscribe(CONFIG_COMPLETE, this.componentID);

  }

  render() {

    let {length} = this.state.likedRoutes

    return (
      <SafeAreaView style={styles.screen}>
        <View style={{backgroundColor: "white", opacity: 1}}>
          <Searchbar 
            style={styles.searchBar}
            placeholder="e.g: Route Number, Route Name, Know Drop off"
            onChangeText={this.handleTextChange}
          />
        </View>
        <ScrollView>
          {this.renderResults()}
        </ScrollView>
      <Snackbar
        visible={this.state.unhearted}
        onDismiss={this.dismissedSnackbar}
        action={{
          label: "undo",
          onPress: this._undoLastUnheart
        }}
      >
        Route removed from favourites
      </Snackbar>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "transparent",
    height: "100%",
    width: Dimensions.get("window").width,
  },
  routeCard: {
    marginEnd: 16,
    marginStart: 16,
    marginBottom: 8,
    backgroundColor: "white",
  },
  searchBar: {
    marginTop: 8,
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    opacity: 1,
    backgroundColor: "white",
    zIndex: 2,
  },
  sectionTitle: {
    marginLeft: 16,
    fontFamily: Theme.OpenSansBold
  },
  cardTitle: {
    fontFamily: Theme.OpenSans
  },
  expandList: {
    color: "blue",
    textAlign: "right", 
    marginRight: 16
  },
});
