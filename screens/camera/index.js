import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {} from 'react-native-paper';
import { RNCamera } from 'react-native-camera';

export default class Camera extends React.PureComponent {

  state = {
    loaded: false,
  };

  componentDidMount() {
    this.setState({loaded: true});
  }

  componentWillUnmount() {
    this.setState({loaded: false});
  }

  camera: React.RefObject<RNCamera> = React.createRef();

  render() {

    return (
      <View style={styles.screen}>
        {
          this.state.loaded && (
            <RNCamera
              ref={this.camera}
              style={styles.camera}
              type={RNCamera.Constants.Type.back}
              defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
              flashMode={RNCamera.Constants.FlashMode.off}
              ratio="16:9"
            >

              <View>
                <Text>This is a test</Text>
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
  controlBar: {
    position: "absolute",
    bottom: 16
  },
});
