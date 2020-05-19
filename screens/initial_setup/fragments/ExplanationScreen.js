import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import {} from 'react-native-paper';
import Theme from '../../../theme';


export default class TerminalPreferencesExp extends React.PureComponent {

  generateText = () => {
    let texts = [];

    let id = 1;

    this.props.text.forEach(line => {
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
      <View style={styles.screen}>
        {this.generateText()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    width: Dimensions.get("window").width,
    height: "100%",
    justifyContent: "center"
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
  }
});