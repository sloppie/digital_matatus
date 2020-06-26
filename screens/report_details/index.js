import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card, Button } from 'react-native-paper'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet';

// ADD TOGGLE BUTTON

import Theme from '../../theme';
import * as Fragments from './fragments';
import { ReportParser } from '../../utilities';

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

    let {culpritDescription} = this.props.route.params.report
    let {incidentDescription} = this.props.route.params.report


    this.state = {
      culpritDescription: JSON.parse(culpritDescription),
      incidentDescription: JSON.parse(incidentDescription),
      mediaVisible: "",
      attachedMedia: [],
      report: new ReportParser(this.props.route.params.report),
      highlightedUrl: null,
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
    this.bottomSheetRef.current.snapTo(0);

    this.props.navigation.navigate("ReportCulprit", {
      highlightedMediaUrl: this.state.highlightedUrl,
      report: this.state.report
    });
  }

  bottomSheetRef: React.RefObject<BottomSheet> = React.createRef();

  _openBottomSheet = (highlightedUrl) => {
    this.setState({highlightedUrl});

    this.bottomSheetRef.current.snapTo(1);
  }

  _renderHeader = () => (
    <Card.Title 
      style={styles.bottomSheetHeader}
      title="Help Report Culprit"
      right={props => <Icon {...props} name="file-find-outline" />}
    />
  );

  _renderContent = () => {
    let contentStyle = {
      height: (Dimensions.get("window").height * 0.5 - 77),
      backgroundColor: "white",
    };

    return (
      <View style={contentStyle}>
        <Text style={{textAlign: "center"}}>{this.state.highlightedUrl}</Text>
        <Button 
          style={styles.reportCulpritButton} 
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
        {
          (this.state.report.hasMedia()) ? this._renderTabLayout(): this._renderReportDetailsTab()
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

  // BottomSheet
  bottomSheetHeader: {
    backgroundColor: "white",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },

  // BottomSheetContent
  reportCulpritButton: {
    position: "absolute",
    width: Dimensions.get("window").width - 64,
    alignSelf: "center",
    bottom: 16,
  }
});
