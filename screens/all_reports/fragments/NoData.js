import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {} from  'react-native-paper';


export default class NoData extends React.PureComponent {

  render() {

    return (
      <View>
        <Text style={StyleSheet.noDataText}>No Data to view</Text>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  noDataText: {
    color: "white",
  },
});
