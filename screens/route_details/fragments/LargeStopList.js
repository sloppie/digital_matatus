import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';

const STOPS = require("../../../GTFS_FEED/stops/stops.json");

const SCREEN_WIDTH = Dimensions.get("window").width;


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


export default class LargeStopList extends React.PureComponent {

  constructor(props) {
    super(props);

    this.id = 0; // used to generate ids for the FlatListComponents
    this.count = 0; // count
    this.toStart = 0; // this store the indice that is the start of the To data
    this.fromName = "";
    this.toName = "";

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

    let dataProvider = new DataProvider((r1, r2) => r1 !== r2);
    
    this.state = {
      dataProvider: dataProvider.cloneWithRows(data),
    };

    this.layoutProvider = new LayoutProvider(
      (index) => {
        return this.state.dataProvider.getDataForIndex(index).type
      }, (type, dim) => {
        dim.width = SCREEN_WIDTH;
        dim.height = 77;
      });

  }

  parseComprehensiveRoute(stop, isSticky=false) {
    let stopData = STOPS[stop];
    stopData.key = stop;
    stopData.stopId = stop;
    stopData.isSticky = isSticky;
    stopData.type = (isSticky) ? "STICKY": "NORMAL";

    return stopData;
  }

  _rowRenderer = (type, item) => {
    
    if(type === "NORMAL")
      return (
        <StopCard 
          listItemAction={this.props.listItemAction}  
          item={item} 
          />
      );
    else
      return (
        <List.Section
          style={styles.stickyHeader} 
          title={`from ${this.toName} - ${this.fromName}`}
        />
      );

  }

  render() {

    return (
      <RecyclerListView 
        style={styles.recyclerListView}
        dataProvider={this.state.dataProvider}
        layoutProvider={this.layoutProvider}
        rowRenderer={this._rowRenderer}
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
  recyclerListView: {
    flex: 1,
  },
});
