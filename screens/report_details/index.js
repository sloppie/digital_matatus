import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Card, Title, List, Divider, ToggleButton } from 'react-native-paper'; 
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../../theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
// ADD TOGGLE BUTTON

import * as Fragments from './fragments';

const toggleButtonIcons = Object.freeze({
  photo: "image",
  video: "video",
  audio: "microphone-outline",
});

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

  _renderToggleButtons = () => {
    let toggleButtons = [];

    toggleButtons = this.state.attachedMedia.map((type, index) => {
      return (
        <ToggleButton 
          icon={props => (
            <Icon
              {...props} 
              name={toggleButtonIcons[type]}
              color={this.state.mediaVisible == type? Colors.red500: "black"}
            />
          )
          }
          value={type}
          status={this.state.mediaVisible === type? "checked": "unchecked"}
          style={styles.toggleButton}
              color={this.state.mediaVisible == type? Colors.red500: "black"}
          key={index.toString()}
        />
      )
    });

    return toggleButtons;
  }

  _renderMediaTab = () => {

          //   (Object.keys(this.state.incidentDescription.media)[0]) ?
          
    let mediaKeys = Object.keys(this.state.incidentDescription.media);

    // let attachedMedia = mediaKeys.filter(media => this.state.incidentDescription.media[media].length !== 0);

    // if(attachedMedia.length > 0)
    //   this.setState({mediaVisible: attachedMedia[0]});
    // else
    //   return [];
    if(!this.state.mediaVisible)
      return (
            <List.Item 
              left={props => <List.Icon icon="cancel" color="white" />}
              title="No media"
              titleStyle={styles.itemTitle}
              description="No media was attached to this report"
              descriptionStyle={styles.descriptionStyle}
            />
      );

    return (
      <>
        <Card.Title
          right={props => <List.Icon icon="paperclip"  color="white" />}
          title="Media Attached"
          titleStyle={styles.sectionTitleStyle}
        />
        <Fragments.Media 
          navigation={this.props.navigation}
          media={this.state.incidentDescription.media[this.state.mediaVisible]}
          report={this.props.route.params.report}
          mediaType={this.state.mediaVisible}
        />
        <ToggleButton.Row 
          onValueChange={this._setMediaVisible}
          style={styles.toggleButtons}>
          {this._renderToggleButtons()}
        </ToggleButton.Row>
      </>
    );
  }

  render() {

    const renderFlags = (incidentDescription) => {
      let flags = "Flags: ";
      Object.keys(incidentDescription.harassmentFlags).forEach((flag) => {
        
        if(incidentDescription.harassmentFlags[flag].length)
          flags += `${flag}, `;

      });

      return flags;
    }

    return (
      <ScrollView 
        style={styles.screen}
        nestedScrollEnabled={true}
      >
        <Icon 
          name="chevron-left" 
          size={30} 
          style={styles.appBarIcon} 
          onPress={this.props.navigation.goBack}
        />
        <Title style={styles.screenLabel}>{this.props.route.params.report._id}</Title>
          {Object.keys(this.state.incidentDescription.media).length > 0 ? this._renderMediaTab(): 
            <List.Item 
              left={props => <List.Icon icon="cancel" color="white" />}
              title="No media"
              description="No media was attached to this report"
            />
          }
        <List.Section
          title="IncidentDescription"
          titleStyle={styles.sectionTitleStyle}
        >
          <List.Item 
            left={props => <List.Icon {...props} icon="calendar-clock" color="white" />}
            title={new Date(this.state.incidentDescription.date).toDateString()}
            titleStyle={styles.itemTitle}
            description="Date of the occurrence"
            descriptionStyle={styles.descriptionStyle}
            style={styles.itemStyle}
          />
          <List.Item 
            left={props => <List.Icon {...props} icon="flag-triangle" color="white" />}
            title={renderFlags(this.state.incidentDescription)}
            titleStyle={styles.itemTitle}
            description="Flags"
            descriptionStyle={styles.descriptionStyle}
            style={styles.itemStyle}
          />
          <List.Item 
            left={props => <List.Icon {...props} icon="map-marker" color="white" />}
            title={this.state.incidentDescription.location.type}
            titleStyle={styles.itemTitle}
            description="Location where it ocurred"
            descriptionStyle={styles.descriptionStyle}
            style={styles.itemStyle}
          />
        </List.Section>
        <Divider style={styles.divider} />
        <List.Section
          title="Culprit Description"
          titleStyle={styles.sectionTitleStyle}
        >
          <List.Item 
            left={props => <List.Icon {...props} icon="bus" color="white" />}
            title="Sacco Implicated"
            titleStyle={styles.itemTitle}
            description={this.state.culpritDescription.saccoName}
            descriptionStyle={styles.descriptionStyle}
            style={styles.itemStyle}
          />
          <List.Item 
            left={props => <List.Icon icon="face" color="white" />}
            title={this.state.culpritDescription.culpritType}
            titleStyle={styles.itemTitle}
            description="Culprit Involved"
            descriptionStyle={styles.descriptionStyle}
            style={styles.itemStyle}
          />
        </List.Section>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#121212",
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
});
