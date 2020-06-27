import React from 'react';
import {FlatList} from 'react-native';

import ReportCard from './ReportCard';


function getItemLayout(data, index) {

  return ({
    length: 152,
    offset: 152 * index,
    index
  });
}

export default class ReportFlatList extends React.PureComponent {

  _keyExtractor = (item) => item._id;

  _renderItem = ({item}) => (
    <ReportCard
      data={item}
      navigation={this.props.navigation}
    />
  );

  render() {

    return (
      <FlatList 
        data={this.props.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
      />
    );
  }

}
