import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { IconButton, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RNCamera, TakePictureOptions } from 'react-native-camera';

export default class Camera extends React.PureComponent {

  state = {
    loaded: false,
    isRecording: true,
    data: null, // picture URI and the base64 of the image will be stored
  };

  camera: React.RefObject<RNCamera> = null;

  PICTURE_OPTIONS: TakePictureOptions = {
    base64: true,
  };

  componentDidMount() {
    this.setState({loaded: true});
  }

  componentWillUnmount() {
    this.setState({loaded: false});
  }

  takePicture = () => {
    let data = null;
    try {
      data = await this.camera.current.takePictureAsync(this.PICTURE_OPTIONS);
    } catch(err) {
      console.log("Unable to capture picture");
    }

    this.setState({data});
  }

  render() {

    return (
      <View style={styles.screen}>
        {
          this.state.loaded && (
            <RNCamera
              ref={(ref) => {this.camera = ref}}
              style={styles.camera}
              type={RNCamera.Constants.Type.back}
              defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
              flashMode={RNCamera.Constants.FlashMode.off}
              ratio="16:9"
            >
              {
                this.state.isRecording && (
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

              <View style={styles.controlBar}>
                <IconButton 
                  style={styles.recordButton}
                  icon="video-outline"
                  size={50}
                  color="white"
                  onPress={() => this.setState({isRecording: !this.state.isRecording})}
                />
                {/* <IconButton 
                  style={styles.recordButton}
                  icon="camera-outline"
                  size={50}
                  color="white"
                  onPress={() => console.log("Icon button pressed")}
                /> */}
              </View>
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
  },
  camera: {
    flex: 1,
    height: Dimensions.get("window").height,
    width: "100%",
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
  controlBar: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    borderColor: "white",
    borderTopWidth: 2,
    paddingTop: 8,
  },
  recordButton: {
    alignSelf: "center",
    textAlign: "center",
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
});
