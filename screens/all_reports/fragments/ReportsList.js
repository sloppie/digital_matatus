import React from 'react';
import { Dimensions } from 'react-native';
import {} from 'react-native-paper';

import { DataProvider, RecyclerListView, LayoutProvider } from 'recyclerlistview';
import ReportCard from './ReportCard';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default class ReportsList extends React.PureComponent {

  constructor(props) {
    super(props);

    let dataProvider = new DataProvider((r1, r2) => r1 !== r2);

    this.state = {
      dataProvider: dataProvider.cloneWithRows(this.props.data),
    };

    this.layoutProvider = new LayoutProvider(
      (index) => {return "REPORT"},
      (type, dim) => {
        dim.width = SCREEN_WIDTH;
        dim.height = 177;
      }
    );

  }

  _rowRenderer = (type, item) => {
    
    return (
      <ReportCard 
        data={item}
        navigation={this.props.navigation}
      />
    );
  }

  render() {

    return (
      <RecyclerListView 
        dataProvider={this.state.dataProvider}
        layoutProvider={this.layoutProvider}
        rowRenderer={this._rowRenderer}
      />
    );
  }

}
