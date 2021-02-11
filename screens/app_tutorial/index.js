import React from 'react';
import {
  Dimensions, 
  StyleSheet, 
} from 'react-native';
import { Colors, IconButton, Snackbar } from 'react-native-paper';
import AppIntroSlider from 'react-native-app-intro-slider';

import * as Fragments from './fragments';
import Theme from '../../theme';


export default class AppIntro extends React.PureComponent {

  state = {
    isVisible: false,
  };

  componentDidMount() {
    this.setState({isVisible: true});
  }

  /**@type Array<{key: Number, title: String, description: String}> */
  _sliderData = [
    {
      key: 1,
      title: "Shake to report",
      description: "Shake to report feature allows report on the fly",
    },
    {
      key: 2,
      title: "Report Incidences fast",
      description: "Report incidences, attach media files, location and culpable saccos",
    },
    {
      key: 3,
      title: "Help identify Potential culprits",
      description: "Help bring culprits to Justice using the DigitalMatatus" +
          " crowdsource identifier on App's ReportView",
    },
    {
      key: 4,
      title: "Report View for cases per route",
      description: "View cases from your \u2764 routes on the fly",
    },
  ];

  /**
   * 
   * @param {{
   * item: {key: Number, title: String, description: String},
   * }} component
   */
  _renderItem = ({item}) =>
    <Fragments.Slide
        image={item.key}
        title={item.title} 
        description={item.description} /> 
  
  _renderNextButton = () => (
    <IconButton icon="chevron-right" color={Colors.orange600} />
  );

  _renderPrevButton = () => (
    <IconButton icon="chevron-left" color={Colors.orange600} />
  );

  _dismissSnackBar = () => this.setState({isVisible: false});

  render() {

    return (
      <>
        <AppIntroSlider 
            style={styles.screen}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.key.toString()}
            data={this._sliderData}
            doneLabel="Skip Sign Up"
            onDone={this._skipSignUp}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
        />
        <Snackbar
          visible={this.state.isVisible}
          action={{label: "Dismiss", onPress: this._dismissSnackBar}}
          onDismiss={this._dismissSnackBar}>
            Swipe to move left or right
        </Snackbar>
      </>
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
