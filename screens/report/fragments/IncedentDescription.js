import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Card, TextInput, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class IncedentDescription extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      description: "",
    };
  }

  _handleDescription = (description) => this.setState({description});

  _handleBlur = () => {
    this.props.setDescription(this.state.description);
  }

  // handle Location
  _handleLocation = () => {
    console.log("The user whats to add location")
  }

  // handle media
  _handleRecording = () => {
    console.log("User wants to record audio");
  }

  _handleVideo = () => {
    console.log("User wants to handle video");
  }

  render() {

    return (
      <View style={styles.container}>
        <Card.Title 
          title={new Date().toDateString()} 
          subtitle="Timestamp added to the report"
        />
        <TextInput
          value={this.state.description}
          style={styles.textInput}
          placeholder="Enter a short description"
          onChange={this._handleDescription}
          onBlur={this._handleBlur}
          mode="outlined"
          label="Description"
          multiline={true}
        />
        <View style={styles.iconContainer}>
          <IconButton 
            icon="crosshairs-gps"
            onPress={this._handleLocation}
            style={styles.mediaIcon}
          />
          <IconButton 
            icon="microphone-outline"
            onPress={this._handleRecording}
            style={styles.mediaIcon}
          />
          <IconButton 
            icon="video"
            onPress={this._handleVideo}
            style={styles.mediaIcon}
          />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  mediaIcon: {
    marginEnd: 16,
  },
});
