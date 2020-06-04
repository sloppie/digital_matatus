import React from 'react';
import { Text, StyleSheet } from 'react-native';
import {} from 'react-native-paper'; 
import { ScrollView } from 'react-native-gesture-handler';

// ADD TOGGLE BUTTON
export default class ReportDetails extends React.PureComponent {

  render() {

    return (
      <ScrollView style={styles.screen}>
        <Text>Test screen</Text>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {},
});
