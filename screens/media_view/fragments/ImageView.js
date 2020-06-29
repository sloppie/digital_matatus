import React from 'react';
import { Dimensions, StyleSheet, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class VideoView extends React.PureComponent {

  render() {

    return(
      <SafeAreaView screen={styles.screen}>
        <Image 
          source={{uri: this.props.uri}}
          style={styles.image}
        />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: "black",
  },
  image: {
    height: SCREEN_HEIGHT,
    position: "absolute",
    width: SCREEN_WIDTH,
    resizeMode: "center",
    backgroundColor: "black",
  },
});
