import React from 'react';
import {View, Image, StyleSheet, Text, Dimensions} from 'react-native';
import {Card, Divider} from 'react-native-paper';
import Theme from '../../../theme';

const Slide = ({image, title, description}) => {
  const renderImage = () => {
    if (image == 1) {
      return (
        <Image
          style={styles.screenshot}
          source={require('../../../assets/images/home-view.png')} />
      );
    } else if (image === 2) {
      return (
        <Image
          style={styles.screenshot}
          source={require('../../../assets/images/report-view.png')} />
      );
    } else if (image === 3) {
      return (
        <Image
          style={styles.screenshot}
          source={require('../../../assets/images/report-details-view.png')} />
      );
    } else if (image === 4) {
      return (
        <Image
          style={styles.screenshot}
          source={require('../../../assets/images/route-details-view.png')} />
      );
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.screenshotContainer}>
        <View style={styles.imageContainer}>
          {renderImage()}
        </View>
      </View>
      <Card style={styles.screenTextContainer}>
        <Text style={styles.screenTitle}>{title}</Text>
        <Divider />
        <Text style={styles.screenDescription}>{description}</Text>
      </Card>
    </View>
  );
};

export default Slide;

const styles = StyleSheet.create({
  screen: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "purple"
  },
  screenshotContainer: {
    paddingTop: 16,
    height: Math.floor(Dimensions.get("window").height * 0.75),
    justifyContent: "center",
  },
  imageContainer: {
    height: (Math.floor(Dimensions.get("window").height * 0.75) - 16),
  },
  screenshot: {
    height: (Math.floor(Dimensions.get("window").height * 0.75) - 32),
    width: (Dimensions.get("window").width - 72),
    resizeMode: "contain",
    alignSelf: "center",
  },
  screenTextContainer: {
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    elevation: 2,
    height: Math.floor(Dimensions.get("window").height * 0.25),
    backgroundColor: "white",
  },
  screenTitle: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 4,
    fontFamily: Theme.OpenSansBold,
    fontSize: 32,
  },
  screenDescription: {
    marginTop: 8,
    marginHorizontal: 16,
    textAlign: "center",
    fontSize: 18,
    fontFamily: Theme.OpenSans
  },
});
