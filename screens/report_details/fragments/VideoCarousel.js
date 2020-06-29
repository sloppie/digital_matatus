import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Card, List, IconButton, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ReportParser, FileManager } from '../../../utilities';


class VideoCard extends React.PureComponent {

  state = {
    uri: this.props.uri,
    thumbnailUri: null,
    thumbnailUriFetched: false,
    videoUri: null,
    // video flags
    isPlaying: false,
  };

  componentDidMount() {

    FileManager.fetchMediaFromUrl(
      this.props.uri, // media url
      this.onFetchVideo.bind(this), // successful video fetch
      this.onFetchThumbnail.bind(this) // successful thumbnail fetch
    );
  }

  onFetchVideo = (videoUri) => this.setState({videoUri})

  onFetchThumbnail = (uris) => {
    this.setState({thumbnailUri: uris.mini, thumbnailUriFetched: true}); 
    this.forceUpdate()
  }


  // video playback options
  _playVideo = () => {

    if(this.state.videoUri !== null) {

      this.props.secondaryNavigation.navigate("MediaView", {
        uri: this.state.videoUri,
        type: "VIDEO",
        mediaUrl: this.state.uri,
      });
    }
  }

  _openBottomSheet = () => {

    if(this.state.videoUri !== null)
      this.props.openBottomSheet(this.state.uri);

  }

  _openCardOptions = () => {

    if(this.state.videoUri !== null)
      this.props.openBottomSheet(this.state.uri);
  }

  render() {
    
    return (
      <View
        style={styles.mediaCard}>
        <>
          {
            this.state.thumbnailUriFetched && (
              <TouchableRipple
                onPress={this._playVideo}
                onLongPress={this._openBottomSheet}
              >
                <Card.Cover 
                  style={styles.cardCover}
                  source={{uri: this.state.thumbnailUri}} 
                  onLoadEnd={() => console.log("Load of image finished from: " + this.state.thumbnailUri)}
                />
              </TouchableRipple>
            )
          }
          {!this.state.thumbnailUriFetched && <Card.Content 
              style={{
                height: (Dimensions.get("window").height * 0.4) - 70,
                backgroundColor: "#141414",
                alignSelf: "stretch",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ActivityIndicator 
                  size="large"
                  animating={true}
                />
              </Card.Content>}
          <Card.Title 
            style={styles.cardTitle}
            left={props => <Icon {...props} name="file-video" />}
            title="Video recorded"
            subtitle="Video recorded during the incident"
            right={props => (
              <Icon 
                {...props}
                name="dots-vertical"
                onPress={this._openCardOptions}
              />
            )}
            rightStyle={styles.cardOptions}
          />
        </>
      </View>
    );
  }

}

export default class VideoCarousel extends React.PureComponent {

  constructor(props) {
    super(props);

    let report = new ReportParser(this.props.report);

    this.state = {
      report,
      data: report.fetchVideos(),
      activeFile: 0,
    };
  }

  _renderItem = ({item}) => (
    <View style={styles.carousel}>
      <View style={styles.iconButtonContainer}>
        <IconButton
          disabled={this.state.activeFile === 0} 
          style={styles.carouselButtons} 
          icon="chevron-left" />
      </View>
      <VideoCard 
        uri={item}
        openBottomSheet={this.props.openBottomSheet}
        secondaryNavigation={this.props.secondaryNavigation}
      />
      <View style={styles.iconButtonContainer}>
        <IconButton 
          disabled={this.state.activeFile === this.state.data.length - 1} 
          size={24}
          style={styles.carouselButtons} 
          icon="chevron-right" />
      </View>
    </View>
  );

  _keyExtractor = (item) => item; // simply a url (which is unique)

  render() {

    if(this.state.data.length == 0)
      return <View />

    return (
      <>
        <List.Section title="Videos" />
          <FlatList
            style={styles.flatList}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            data={this.state.report.fetchVideos()}
            pagingEnabled={true}
            horizontal={true}
          />
      </>
    );
  }

}

const styles = StyleSheet.create({
  flatList: {
    height: Math.floor(Dimensions.get("window").height * 0.4),
    width: Dimensions.get("window").width,
  },
  carousel: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
  },
  iconButtonContainer: {
    flex: 1,
    width: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    elevation: 3,
    zIndex: 3,
    backgroundColor: "teal",
  },

  // VideoCard styling
  mediaCard: {
    flex: 9,
    width: (Dimensions.get("window").width - 32),
    minHeight: Math.floor(Dimensions.get("window").height * 0.4),
    maxHeight: Math.floor(Dimensions.get("window").height * 0.4),
    alignSelf: "center",
    paddingBottom: 0,
    borderColor: "#999",
    borderWidth: 1, 
    borderRadius: 10,
    marginBottom: 32,
  },
  cardCover: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  cardTitle: {
    paddingBottom: 0,
    marginBottom: 0,
    alignSelf: "baseline",
  },
  cardOptions: {
    marginEnd: 8,
  },
});
