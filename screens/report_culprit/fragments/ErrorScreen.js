import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';


export default class ErrorScreen extends React.PureComponent {

  render() {

    return (
      <View>
        <Text>Error Loading reports</Text>
        <Button>RETRY</Button>
      </View>
    );
  }

}
