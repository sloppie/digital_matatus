import React from 'react';
import { SafeAreaView, Text, ImageBackground, Dimensions, StyleSheet, StatusBar } from 'react-native';
import { Title, Colors } from 'react-native-paper';
import AppIntroSlider from 'react-native-app-intro-slider';

import * as Fragments from './fragments';
import Theme from '../../theme';


export default class AppIntro extends React.PureComponent {

  _navigateToLogin = () => this.props.navigation.navigate("Login")

  /**@type Array<{key: Number, title: String, description: String}> */
  _sliderData = [
    {
      key: 1,
      title: "Shake to report",
      description: "Shake to report feature\n allows report on the fly",
    },
    {
      key: 2,
      title: "Report Incidences fast",
      description: "Report incidences,\nattach media files,\nlocation and\n culpable saccos",
    },
    {
      key: 3,
      title: "Help identify Potential culprits",
      description: "Help\nbring culprits\n to Justice using\n the DigitalMatatus" +
          "\ncrowdsource identifier\non App's\nReportView",
    },
    {
      key: 4,
      title: "Report View for cases per route",
      description: "View cases from\n your \u2764 routes\n on the fly",
    },
    {key: 5}
  ];

  _renderItem = ({/**@type {{key: Number, title: String, description: String}}*/ item}) =>
      (item.key !== 5) ? 
          <Fragments.IntroductionScreeen 
              key_={item.key}
              title={item.title} 
              description={item.description} /> 
          : <Fragments.FinishScreen navigation={this.props.navigation} />

  render() {

    return (
        <AppIntroSlider 
            style={styles.screen}
            renderItem={this._renderItem}
            data={this._sliderData}
            doneLabel="Log in"
            onDone={this._navigateToLogin}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
            /* showSkipButton={true} */
        />
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.PrimaryColor,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
  },
  imageBackground: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  dotStyle: {
    color: Theme.PrimaryColor,
    backgroundColor: Theme.PrimaryColor,
  },
  activeDotStyle: {
    color: Colors.orange600,
    backgroundColor: Colors.orange600,
  },
});
