import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Theme from '../../../theme';

export default class LoadingScreen extends React.PureComponent {

  finalise = () => {
    console.log('Finalising from LoadingScreen');
    if(this.props.skipSignUp)
      this.props._finalise();
  }

  render() {

    return (
      <View style={styles.screen}>
        <ActivityIndicator 
          color={Theme.PrimaryColor}
          size="large"
          style={styles.activityIndicator}
          animating={true}
        />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Creating user profile...</Text>
        </View>
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
  activityIndicator: {
    alignSelf: "center",
    marginBottom: 8
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
