import React from 'react';
import { 
  StatusBar, 
  SafeAreaView,
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Dimensions, 
} from 'react-native';
import {} from 'react-native-paper';

import Theme from '../../../theme';


export default class IntroductionScreeen extends React.PureComponent {

  generateText = () => {
    /** @type {Array<React.Component>}*/const texts = [];

    let id = 1;

    // split the description and render the lines one by one
    this.props.description.split("\n").forEach(line => {
      texts.push(
        <View key={id.toString()} style={styles.textContainer}>
          <Text style={styles.text}>{line}</Text>
        </View>
      );

      id++;
    });

    return texts;

  }

  render() {

    return (
        <SafeAreaView style={styles.screen}>
          {
            this.props.key_ === 1 && (
              <ImageBackground
                  style={styles.imageBackground}
                  source={require('../../../assets/images/home-view.png')} >
                {this.generateText()}
              </ImageBackground>
            )
          }
          {
            this.props.key_ === 2 && (
              <ImageBackground
                  style={styles.imageBackground}
                  source={require('../../../assets/images/report-view.png')} >
                {this.generateText()}
              </ImageBackground>
            )
          }
          {
            this.props.key_ === 3 && (
              <ImageBackground
                  style={styles.imageBackground}
                  source={require('../../../assets/images/report-details-view.png')} >
                {this.generateText()}
              </ImageBackground>
            )
          }
          {
            this.props.key_ === 4 && (
              <ImageBackground
                  style={styles.imageBackground}
                  source={require('../../../assets/images/route-details-view.png')} >
                {this.generateText()}
              </ImageBackground>
            )
          }
        </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: Theme.PrimaryColor,
  },
  imageBackground: {
    width: null,
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.PrimaryColor,
  },
  textContainer: {
    alignSelf: "center",
  },
  text: {
    fontFamily: Theme.OpenSansBold,
    textAlign: "center",
    backgroundColor: "black",
    fontSize: 30,
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
});
