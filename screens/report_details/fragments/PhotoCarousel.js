import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Card, List, IconButton, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ReportParser, FileManager } from '../../../utilities';


class MediaCard extends React.PureComponent {
 
  state = {
    mediaUri: null,
    mediaUriFetched: false,
  };

  componentDidMount() {
    FileManager.fetchMediaFromUrl(this.props.uri, this.onFetchPicture.bind(this));
  }

  onFetchPicture = (uri) => {
    console.log("created file: \n" + uri)
    this.setState({mediaUri: uri, mediaUriFetched: true})
    this.forceUpdate();
  }

  _openBottomSheet = () => {
    this.props.openBottomSheet(this.props.uri);
  }

  render() { 

    return (
      <Card 
        style={styles.mediaCard}
        onLongPress={this._openBottomSheet}>
        {
          this.state.mediaUriFetched &&
          <Card.Cover 
            source={{uri: this.state.mediaUri}} 
            onLoadEnd={() => console.log("Load of image finished from: " + this.state.mediaUri)}
          />
        }
        {
          !this.state.mediaUriFetched && <Card.Content 
              style={{
                height: (Dimensions.get("window").height * 0.4) - 70,
                backgroundColor: "#141414",
                alignSelf: "stretch",
              }}></Card.Content>
        }
        <Card.Title 
          style={styles.cardTitle}
          left={props => <Icon {...props} name="image" />}
          title="Image"
          subtitle="Photo taken during the incident"/>
      </Card>
    );
  }

}


export default class PhotoCarousel extends React.PureComponent {

  constructor(props) {
    super(props);

    let report = new ReportParser(this.props.report);
    this.state = {
      report,
      data: report.fetchPhotos(),
      activeFile: 0, // should be changeable by the carousel
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
      <MediaCard
        style={styles.mediaCard}
        uri={item}
        openBottomSheet={this.props.openBottomSheet}
      />
      <View style={styles.iconButtonContainer}>
        <IconButton 
          disabled={this.state.activeFile == this.state.data.length - 1} 
          size={24}
          style={styles.carouselButtons} 
          icon="chevron-right" />
      </View>
    </View>
  );

  _renderItems = () => this.state.report.fetchPhotos().map(photo => (
    <Card
      style={styles.mediaCard}
      onLongPress={this._showReportOptions}
      key={photo}
    >
      <Card.Cover source={photo} />
      <Card.Title title="Photo" subtitle="Photo taken during the incident"/>
    </Card>
  ));

  _keyExtractor = (item) => item; // since the item is simply a url

  render() {

    if(this.state.data.length == 0)
      return <View />
    
    return (
      <>
        <List.Section title="Photos" />
          <FlatList
            data={this.state.data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            pagingEnabled={true}
            style={styles.flatList}
          />
      </>
    );
  }

}


const styles = StyleSheet.create({
  flatList: {
    flex: 1,
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

  // MediaCard Styling
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
