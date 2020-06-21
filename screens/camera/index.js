import React from 'react';
import { 
  View, 
  Dimensions, 
  StyleSheet, 
  ToastAndroid, 
  DeviceEventEmitter,
  ActivityIndicator,
  Image, 
} from 'react-native';
import { IconButton, Chip, FAB, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RNCamera, TakePictureOptions, RecordOptions } from 'react-native-camera';

import { FileManager } from '../../utilities';
import { HOME_NAVIGATION_REF } from '../../routes/AppDrawer';


export default class Camera extends React.PureComponent {

  constructor(props) {
    super(props);

    let active = this.props.route.params.type === "camera";

    this.state = {
      loaded: false,
      isRecording: true,
      data: null, // picture URI and the base64 of the image will be stored
      isRecording: false, // flag used together with this.state.active to render back cam
      active, // if true: camera false: video
      backCamera: true, // if true: "back", false: "front"
      pictureTaken: false, // used to know which screen to render
      type: null,
    };
  }


  // camera ref
  camera = null;

  PICTURE_OPTIONS: TakePictureOptions = {
    base64: true,
    quality: 0.5,
    pauseAfterCapture: true,
  };

  VIDEO_OPTIONS: RecordOptions = {
    quality: RNCamera.Constants.VideoQuality["480p"], // big enough to play
  };

  componentDidMount() {
    this.setState({loaded: true});
  }

  componentWillUnmount() {
    this.setState({loaded: false});
  }

  // toggle the camera (front and rear)
  _toggleCamera = () => this.setState({backCamera: !this.state.backCamera});

  // toggle active mode (video and camera)
  _toggleActive = (active) => this.setState({active});

  _setPhoto = (data) => {
    console.log(data.uri)
    this.setState({data: data.uri});
    setTimeout(() => {
      FileManager.copyMediaFile(data.uri, FileManager.IMAGE);
    }, 1000);
    // this.forceUpdate();
  }

  _setVideoData = (result) => {
    console.log(`Video Thumbnail: ${result.path}`);
    this.setState({videoThumbnail: result.path});
    setTimeout(() => {
      FileManager.copyMediaFile(this.state.data, FileManager.VIDEO);
    }, 500);
  }

  _setVideo = (data) => {
    this.setState({pictureTaken: true});
    console.log(data.uri);
    this.setState({data: data.uri});
    // setTimeout(async () => {
      let Thumbnail = require('react-native-thumbnail').default;

      Thumbnail.get(data.uri).then(this._setVideoData).catch(err => console.log(err));
    // }, 1000);

  }

  takePicture = () => {
    this.setState({pictureTaken: true, type: FileManager.IMAGE});

      this.camera.takePictureAsync(this.PICTURE_OPTIONS).then(this._setPhoto).catch(err => {
        this.setState({pictureTaken: true});
        console.log(err);
        ToastAndroid.show("Unable to capture", ToastAndroid.SHORT);
      });
  }

  /**
   * This is the callback to be invoked after the `NativeModules.FileManager.copyMediaFile`
   * completes moving the File from cache to `DCIM/DigitalMatatus/${type}/${fileName}`
   * 
   * @param {String} status this is the Status of the call ("WRITE_SUCCESS", "WRITE_ERR")
   * @param {String} fileLocation this is the new File location of the File after completion
   */
  getFileLocation = (status, fileLocation) => {
    
    if(status === FileManager.WRITE_SUCCESS) {
      console.log(FileManager.WRITE_SUCCESS);
      console.log(fileLocation);
      // emit the Event and and send the fileLocation to the Listeners
    } else {
      console.log("Error writin file");
    }

  }

  takeVideo = async () => {
    this.setState({isRecording: true, type: FileManager.VIDEO});
    this.camera.recordAsync(this.VIDEO_OPTIONS).then(this._setVideo).catch(err => {
      console.log("Unable to record video");
    })
  }

  stopRecording = () => {
    this.camera.stopRecording();
  }

  _renderPhotoControlBar = () => (

    <View style={styles.controlBar}>
      <IconButton 
        onPress={this._toggleCamera}
        icon="repeat"
        size={24}
      />
      <IconButton
        style={styles.actionButton}
        onPress={this.takePicture}
        icon="record"
        color="red"
        size={50}
      />
      <IconButton 
        onPress={this._toggleActive.bind(this, false)}
        icon="video-outline"
        size={24}
      />
    </View>
  );

  _renderVideoControlBar = () => (

    <View style={styles.controlBar}>
      <IconButton 
        onPress={this._toggleCamera}
        icon="repeat"
        size={24}
      />
      <IconButton 
        style={styles.actionButton}
        onPress={(!this.state.isRecording)? this.takeVideo: this.stopRecording}
        icon={(!this.state.isRecording)? "record": "stop"}
        color={(this.state.isRecording)? "black": "red"}
        size={50}
      />
      <IconButton 
        onPress={this._toggleActive.bind(this, true)}
        icon="camera-outline"
        size={24}
      />
    </View>
  );

  _renderPreview = () => {
      return (
        <View style={styles.screen}>
          <Image 
            source={{
              uri: (
                (this.state.type == FileManager.IMAGE)? 
                  this.state.data
                : this.state.videoThumbnail
              ), 
              width: Dimensions.get("window").width, 
              height:(Math.floor(Dimensions.get("window").height * 0.75))
            }}
          />
          <View style={styles.confirmBar}>
            <Card.Title 
              left={props => <Icon {...props} name="filmstrip"/>}
              title="Media Captured"
              subtitle="This media will be added to the report you are filing"
            />
            <FAB
              style={styles.confirmButton}
              label="Confirm"
              icon="chevron-right"
              onPress={this.confirmMedia}
            />
          </View>
        </View>
      );
  }

  confirmMedia = () => {
    console.log("Button pressed");
    requestAnimationFrame(() => {
      if(this.props.route.params.source === "Report") {
        DeviceEventEmitter.emit("WRITE_SUCCESS", this.state.data, this.state.type);
        this.props.navigation.pop();
      } else {
        HOME_NAVIGATION_REF.navigate("Report");
        DeviceEventEmitter.emit("WRITE_SUCCESS", this.state.data, this.state.type);
      }
    });

  }

  render() {

    if(this.state.data)
      return this._renderPreview();

    return (
      <View style={styles.screen}>
        {
          this.state.loaded &&  (
            <RNCamera
              ref={(ref) => {this.camera = ref}}
              style={styles.camera}
              type={(this.state.backCamera)? RNCamera.Constants.Type.back: RNCamera.Constants.Type.front}
              defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
              flashMode={RNCamera.Constants.FlashMode.off}
              ratio="16:9"
            >
              {
                this.state.pictureTaken ?
                  <Chip 
                    icon={props => (
                      <Icon {...props} name="record" color="red" />
                    )} 
                    mode="outlined" 
                    style={styles.processingChip} 
                    textStyle={styles.recordingChipText}
                  >
                    Processing...
                  </Chip>
                : null
              }
              {
                this.state.isRecording && !this.state.active && (
                  <Chip 
                    icon={props => (
                      <Icon {...props} name="record" color="red" />
                    )} 
                    mode="outlined" 
                    style={styles.recordingChip} 
                    textStyle={styles.recordingChipText}
                  >
                    Recording
                  </Chip>
                )
              }

              {
                this.state.pictureTaken ?
                  <ActivityIndicator 
                    animating={true}
                    size="large"
                    color="white"
                  />
                : null
              }

              {this.state.active? this._renderPhotoControlBar(): this._renderVideoControlBar()}
            </RNCamera>
          )
        }
    </View>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    height: Dimensions.get("window").height,
  },
  camera: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: "100%",
  },
  processingChip: {
    marginTop: 8,
    marginStart: 16,
    alignSelf: "flex-start",
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent"
  },
  recordingChip: {
    marginTop: 8,
    marginEnd: 16,
    alignSelf: "flex-end",
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent"
  },
  recordingChipText: {
    color: "white",
  },
  recordButton: {
    alignSelf: "center",
    textAlign: "center",
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  actionButton: {
    backgroundColor: "red",
  },
  controlBar: {
    width: Dimensions.get("window").width,
    height: Math.floor(Dimensions.get("window").height * 0.3333),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    paddingTop: 8,
    backgroundColor: "white",
  },
  confirmBar: {
    width: Dimensions.get("window").width,
    height: Math.floor(Dimensions.get("window").height * 0.25),
    // position: "absolute",
    bottom: 0,
    paddingTop: 8,
    backgroundColor: "white",
  },
  confirmButton: {
    position: "absolute",
    width: (Dimensions.get("window").width - 64),
    alignSelf: "center",
    bottom: 16,
    backgroundColor: "red",
  },
});
