import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Card, List, IconButton } from 'react-native-paper';
import { ReportParser, FileManager } from '../../../utilities';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


class VideoCard extends React.PureComponent {

  state = {
    thumbnailUri: null,
    videoUri: null,
  };

  componentDidMount() {

    FileManager.fetchMediaFromUrl(
      this.props.uri, // media url
      this.onFetchVideo, // successful video fetch
      this.onFetchThumbnail // successful thumbnail fetch
    );
  }

  onFetchVideo = (videoUri) => this.setState({videoUri})

  onFetchThumbnail = (uris) => this.setState({thumbnailUri: uris.mini});

  _openBottomSheet = () => {
    this.props.openBottomSheet(this.props.uri);
  }

  render() {
    
    return (
      <Card 
        style={styles.mediaCard}
        onLongPress={this._openBottomSheet}>
        {
          this.state.mediaUri ?
          <Card.Cover 
            source={{uri: this.state.thumbnailUri}} 
            onLoadEnd={() => console.log("Load of image finished from: " + this.state.mediaUri)}
          />
          : <Card.Content 
              style={{
                height: (Dimensions.get("window").height * 0.4) - 70,
                backgroundColor: "#141414",
                alignSelf: "stretch",
              }}></Card.Content>
        }
        <Card.Title 
          style={styles.cardTitle}
          left={props => <Icon {...props} name="file-video" />}
          title="Video recorded"
          subtitle="Video recorded during the incident"/>
      </Card>
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

  _showReportOptions = () => {
    console.log("Showing report options");
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

  _keyExtractor = (item) => item; // since the item is simply a url

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
  // mediaCard: {
  //   flex: 9,
  //   width: (Dimensions.get("window").width - 32),
  //   height: Math.floor(Dimensions.get("window").height * 0.4),
  //   alignSelf: "center",
  // },
  mediaCard: {
    flex: 9,
    width: (Dimensions.get("window").width - 32),
    minHeight: Math.floor(Dimensions.get("window").height * 0.4),
    maxHeight: Math.floor(Dimensions.get("window").height * 0.4),
    alignSelf: "center",
    paddingBottom: 0,
  },
  cardTitle: {
    paddingBottom: 0,
    marginBottom: 0,
    alignSelf: "baseline",
  },
});
