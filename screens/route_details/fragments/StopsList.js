import React from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const STOPS = require("../../../GTFS_FEED/stops/stops.json");

let count = 0;
let renderCount = 0;


class StopCard extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  _setMarker = (item) => {
    requestAnimationFrame(() => this.props.listItemAction(item))
  }

  render() {
    let {item} = this.props;

    return (
      <List.Item 
        style={styles.item}
        left={props => <Icon {...props} name="traffic-light" size={30} style={styles.stopIcon}/>}
        title={item.name}
        description={item.stopId}
        onPress={this._setMarker.bind(this, item)}
      />
    );
  }
}

export default class StopsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: [],
      toStart: 0 
    };

    this.id = 0; // used to generate ids for the FlatListComponents
    this.count = 0; // count
    this.toStart = 0; // this store the indice that is the start of the To data
    this.fromName = "";
    this.toName = "";
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.data.length !== nextState.data.length;
  }

  componentDidMount() {
    this._setStateData();
  }

  componentWillUnmount() {
    // this.setState({isLoading: true})
  }

  parseComprehensiveRoute(stop, isSticky=false) {
    let stopData = STOPS[stop];
    stopData.key = stop;
    stopData.stopId = stop;
    stopData.isSticky = isSticky;

    return stopData;
  }

  generateData() {
    
    return new Promise((resolve, reject) => {
    let data = [];
    let err = false;
    
      try {
        // redo the start stop to create a sticky indice
        // let firstTerminal = this.parseComprehensiveRoute(this.props.data.from[0], count);
        // data.push(firstTerminal)
        
        this.props.data.from.forEach((stop, index) =>{
          let parsedData = this.parseComprehensiveRoute(stop);

          if(!index)
          this.fromName = parsedData.name;
          
          data.push(parsedData);
        });
        
        this.toStart = data.length;
        // redo the start stop to create a sticky indice
        data.push(this.parseComprehensiveRoute(this.props.data.to[0], true))
        
        this.props.data.to.forEach((stop, index) => {
          let parsedData = this.parseComprehensiveRoute(stop);
          
          if(!index)
            this.toName = parsedData.name;
          
          data.push(parsedData);
        });
        
      } catch(err) {
        err = true;
      }
        if(!err)
          resolve(data);
        else
        reject(err);

    });
  }

  _setStateData = async () => {
    this.generateData()
        .then(response => setTimeout(() => this.setState({data: response, isLoading: false, toStart: this.toStart}), 30))
        .catch(err => {console.warn(err)})
  }

  _setMarker = (item) => {
    requestAnimationFrame(() => this.props.listItemAction(item))
  }

  _keyExtractor = (item) => (++(this.id)).toString();

  _renderItems = ({item}) => {
    // let renderedItem = [];

    // this.state.data.forEach((item, index) => {

      if(count == this.toStart) {
        count++;
        /* renderedItem.push */return (
          // key={`${index}`}
          <List.Section
            style={styles.stickyHeader} 
            title={`from ${this.toName} - ${this.fromName}`}
          />
        ); 
      }
      else {
        count++;
        /*renderedItem.push*/return (
          // key={`${index}`}
          <StopCard 
            listItemAction={this.props.listItemAction}  
            item={item} 
            />
        );
      }
  
    // });

    // return renderedItem;
  }

  render() {

    renderCount++;
    console.log("renderCount: " + renderCount)

    return (
      <FlatList
        style={styles.flatList}
        data={this.state.data} 
        renderItem={this._renderItems}
        keyExtractor={this._keyExtractor}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        renderToHardwareTextureAndroid={true}
        updateCellsBatchingPeriod={100}
        ListEmptyComponent={props => (
        <View style={{justifyContent: "center", alignSelf: "center"}}>
          <ActivityIndicator
            size="large" 
            animating={true}
            style={{alignSelf: "center"}}
          />
          <Text>Fetching stops...</Text>
        </View>
        )}
      />
    );
  }

}

const styles = StyleSheet.create({
  stickyHeader: {
    backgroundColor: "white"
  },
  item: {},
  stopIcon: {
    textAlignVertical: "center"
  },
  flatList: {
    flex: 1,
  },
});
