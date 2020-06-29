import React from 'react';
import { StatusBar, SafeAreaView, View, Image, StyleSheet, Dimensions, } from 'react-native';
import { IconButton } from 'react-native-paper';
import Video from 'react-native-video';

import { FileManager } from '../../../utilities';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;


class ControlBar extends React.PureComponent {

  state = {
    playing: false,
  };

  _togglePlayback = () => {
    this.setState({playing: !this.state.playing});

    this.props.togglePlayback();
  }

  render() {

    return(
      <View style={styles.controlBar}>
        <IconButton 
          icon={(this.state.playing)? "pause": "play"}
          color="white"
          onPress={this._togglePlayback}
          size={50}
        />
      </View>
    );
  }

}


export default class VideoView extends React.PureComponent {

  state = {
    play: false,
    initialPlay: false,
    videoThumbnail: null,
  };

  video: Video;

  controlBarRef: React.RefObject<ControlBar> = React.createRef();

  componentDidMount() {
    FileManager.fetchThumbnails(
      this.props.mediaUrl,
      this._setVideoThumbnail // set the thumbnail
    );
  }

  // setVideoThumbnail
  _setVideoThumbnail = ({full}) => this.setState({videoThumbnail: full});

  _togglePlayback = () => this.setState({play: !this.state.play, initialPlay: true});

  _toggleControlBarStatus = () => {
    this.controlBarRef.current._togglePlayback();
  }

  render() {

    return(
      <>
        <StatusBar barStyle="dark-content" backgroundColor="black"/>
        <SafeAreaView style={styles.screen}>
          {
            (!this.state.initialPlay &&  this.state.videoThumbnail !== null) && (
              <Image 
                style={styles.videoThumbnail}
                source={{uri: this.state.videoThumbnail}}
                onLoadEnd={() => console.log("IMAGE_LOADED")}
              />
            )
          }
          <Video
            ref={ref => this.video = ref}
            style={styles.video}
            source={{uri: this.props.uri}}
            paused={!this.state.play}
            fullscreen={true}
            fullscreenAutorotate={true}
            resizeMode="contain"
            onEnd={this._toggleControlBarStatus}
          />
          <ControlBar 
            ref={this.controlBarRef}
            togglePlayback={this._togglePlayback}
          />
        </SafeAreaView>
      </>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black"
  },

  // videoThumbnail
  videoThumbnail: {
    position: "absolute",
    zIndex: 1,
    height: 300,
    width: SCREEN_WIDTH,
    flex: 1,
  },

  // video
  video: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    alignSelf: "center",
    // zIndex: 4,
    // elevation: 3,
    backgroundColor: "black"
  },

  // controlBar
  controlBar: {
    width: SCREEN_WIDTH,
    height: Math.floor(SCREEN_HEIGHT * 0.25),
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
  },
});
