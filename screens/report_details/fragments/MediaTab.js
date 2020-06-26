import React from 'react';
import { ScrollView, StyleSheet, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Card, List, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet';

import { ReportParser } from '../../../utilities';
import PhotoCarousel from './PhotoCarousel';
import VideoCarousel from './VideoCarousel';
import AudioCarousel from './AudioCarousel';


export default class MediaTab extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      incidentDescription: JSON.parse(this.props.report.incidentDescription), // media from the incident
      highlightedUrl: null,
    };
  }

  _renderMedia = () => (
    Object.keys(this.state.incidentDescription.media)
      .map(mediaType => ( // conditional return below
        (mediaType === "photo") ? // if "photo" return PhotCarousel
          <PhotoCarousel 
            key={mediaType}
            secondaryNavigation={this.props.secondaryNavigation}
            openBottomSheet={this.props.openBottomSheet}
            report={this.props.report} />
        :(mediaType === "video") ? // if "video return VideoCarousel"
          <VideoCarousel 
            key={mediaType}
            secondaryNavigation={this.props.secondaryNavigation}
            openBottomSheet={this.props.openBottomSheet}
            report={this.props.report}/> 
        : // return AudioCarousel
          <AudioCarousel
            key={mediaType}
            secondaryNavigation={this.props.secondaryNavigation}
            openBottomSheet={this.props.openBottomSheet}
            report={this.props.report}/>
      ))
  );

  render() {

    return (
      <SafeAreaView style={styles.screenContainer}>
        <ScrollView 
          style={styles.screen}
          nestedScrollEnabled={true}
        >
          {this._renderMedia()}
        </ScrollView>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screenContainer: {
    alignSelf: "stretch",
  },
  screen: {
    // height: "100%",
    // width: "100%",
  },

  // FlatList
  flatList: {
    height: Math.floor(Dimensions.get("window").height * 0.4),
    width: Dimensions.get("window").width,
  },

  // BottomSheet
  reportCulpritButton: {
    width: (Dimensions.get("window").width - 64),
  },
});
