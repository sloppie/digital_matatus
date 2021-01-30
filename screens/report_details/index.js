import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Card, List, Button, Colors, TouchableRipple } from 'react-native-paper'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet';

// ADD TOGGLE BUTTON

import Theme from '../../theme';
import * as Fragments from './fragments';
import { ReportParser, FileManager } from '../../utilities';

console.log("ReportDetails is being loaded");

const toggleButtonIcons = Object.freeze({
  photo: "image",
  video: "video",
  audio: "microphone-outline",
});

let ReportTab = null;
let ReportDetailsTab = null;

export default class ReportDetails extends React.PureComponent {

  constructor(props) {
    super(props);

    console.log("Report Details is trying to render");

    let {culpritDescription} = this.props.route.params.report
    let {incidentDescription} = this.props.route.params.report


    this.state = {
      culpritDescription: JSON.parse(culpritDescription),
      incidentDescription: JSON.parse(incidentDescription),
      mediaVisible: "",
      attachedMedia: [],
      report: new ReportParser(this.props.route.params.report),
      highlightedUrl: null,
      highlightedUrlThumbnail: null,
      bottomSheetOpen: false,
    };
    console.log(JSON.stringify(this.state.incidentDescription.media, null, 2));
  }

  componentDidMount() {
    let mediaKeys = Object.keys(this.state.incidentDescription.media);

    let attachedMedia = mediaKeys.filter(media => this.state.incidentDescription.media[media].length !== 0);

    if(attachedMedia.length > 0)
      this.setState({attachedMedia, mediaVisible: attachedMedia[0]});
  }

  _setMediaVisible = (mediaVisible) => this.setState({mediaVisible});

  _reportCulprit = () => {
    this.setState({bottomSheetOpen: false});
    this.bottomSheetRef.current.snapTo(0);

    this.props.navigation.navigate("ReportCulprit", {
      highlightedMediaUrl: this.state.highlightedUrl,
      report: this.state.report
    });
  }

  bottomSheetRef: React.RefObject<BottomSheet> = React.createRef();

  _collapseOverlay = () => {
    this.setState({bottomSheetOpen:  false});
    this.bottomSheetRef.current.snapTo(0);
  }

  _openBottomSheet = (highlightedUrl) => {
    this.setState({highlightedUrl, bottomSheetOpen: true});

    this.bottomSheetRef.current.snapTo(1);

    // image is already cached
    FileManager.fetchMediaFromUrl(highlightedUrl, this._onBottomSheetImageFetched);
  }

  _onBottomSheetImageFetched = (highlightedUrlThumbnail) => this.setState({highlightedUrlThumbnail});

  _renderHeader = () => (
    <Card.Title 
      style={styles.bottomSheetHeader}
      title="Help Report Culprit"
      titleStyle={styles.bottomSheetHeaderTitle}
      subtitle="Help report culprit you recognised in this media file"
      subtitleStyle={styles.bottomSheetHeaderSubtitle}
      right={props => <List.Icon {...props} icon="file-find-outline" color="white" />}
      rightStyle={styles.bottomSheetHeaderRight}
    />
  );

  _renderContent = () => {
    let contentStyle = {
      height: (Dimensions.get("window").height * 0.5 - 70),
      backgroundColor: Theme.PrimaryColor,
    };

    let imageDimensions = Dimensions.get("window").width - 64;

    return (
      <View style={contentStyle}>
        {
          this.state.highlightedUrlThumbnail && (
            <Card.Cover
              style={styles.bottomSheetImage}
              width={imageDimensions}
              height={imageDimensions}
              source={{
                uri: this.state.highlightedUrlThumbnail,
                width: imageDimensions,
                height: imageDimensions,
              }}
            />
          )
        }
        <Button 
          style={styles.reportCulpritButton} 
          color={Colors.red300}
          mode="outlined"
          icon="file-find-outline"
          onPress={this._reportCulprit}>
            Report Culprit
        </Button>
      </View>
    );
  };


  _renderTabLayout = () => {
    if(ReportTab === null)
      ReportTab = require('./fragments').ReportTab;
    
    return (
      <ReportTab 
        secondaryNavigation={this.props.navigation}
        report={this.props.route.params.report}
        openBottomSheet={this._openBottomSheet}
      />
    );
  }

  _renderReportDetailsTab = () => {
    if(ReportDetailsTab === null)
      ReportDetailsTab = require('./fragments').ReportDetailsTab;
    
    return (
      <ReportDetailsTab 
        report={this.props.route.params.report}
      />
    );
  }

  render() {

    return (
      <SafeAreaView 
        style={styles.screen}
      >
        { (this.state.report.hasMedia()) && this._renderTabLayout() }
        { !this.state.report.hasMedia() && this._renderReportDetailsTab() }
        {
          this.state.bottomSheetOpen && (
            <TouchableRipple
              style={styles.overlay}
              rippleColor="#00000000"
              onPress={this._collapseOverlay}>
              <View></View>
            </TouchableRipple>
          )
        }
        <BottomSheet 
          ref={this.bottomSheetRef}
          snapPoints={[0, "50%"]} 
          initialSnap={0}
          renderContent={this._renderContent}
          renderHeader={this._renderHeader}
        />
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    // backgroundColor: "#121212",
    height: "100%",
  },
  screenLabel: {
    marginTop: 16,
    fontSize: 30,
    marginLeft: 16,
    fontFamily: Theme.OpenSansBold,
    color: "white"
  },
  appBarIcon: {
    marginTop: 8,
    paddingLeft: 8,
    color: "white"
  },
  divider: {
    backgroundColor: "white",
  },
  sectionTitleStyle: {
    color: "white"
  },
  itemStyle: {
    backgroundColor: "#121212",
    opacity: 0.95,
  },
  itemTitle: {
    color: "white"
  },
  descriptionStyle: {
    color: "white",
  },
  toggleButtons: {
  },
  toggleButton: {
    backgroundColor: "white",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 4,
  },

  overlay: {
    // position: "absolute",
    ...StyleSheet.absoluteFill,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#00000080",
  },

  // BottomSheet
  bottomSheetHeader: {
    backgroundColor: Theme.PrimaryColor,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
  },
  bottomSheetHeaderTitle: {
    color: "white",
  },
  bottomSheetHeaderSubtitle: {
    color: "white",
  },
  bottomSheetHeaderRight: {
    color: "white",
  },

  // BottomSheetContent
  reportCulpritButton: {
    position: "absolute",
    width: Dimensions.get("window").width - 64,
    alignSelf: "center",
    bottom: 16,
    color: Colors.red400,
  },
  bottomSheetImage: {
    alignSelf: "center",
    width: (Dimensions.get("window").width - 64),
    borderRadius: 20,
  },
});
