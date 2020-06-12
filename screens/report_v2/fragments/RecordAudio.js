import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, TouchableRipple, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class RecordPanel extends React.PureComponent {

  _startRecording = () => {}

  _stopRecording = () => {}

  _renderActiveStop = () => (
    <TouchableRipple
      onPress={this._stopRecording}
    >
      {this._renderStopIcon()}
    </TouchableRipple>
  );

  _renderStopIcon = () => (
    <Icon 
      name="stop" 
      color={this.props.isRecording && !this.props.recorded? Colors.red600: Colors.grey400}
      style={styles.actionIcon}
    />
  );

  _renderActiveRecording = () => (
    <TouchableRipple
      onPress={this._startRecording}
    >
      {this._renderRecordingIcon()}
    </TouchableRipple>
  );

  _renderRecordingIcon = () => (
    <Icon 
      name="record" 
      color={!this.props.isRecording && !this.props.recorded? Colors.red600: Colors.grey400}
      style={styles.actionIcon}
    />
  );

  render() {

    if(this.props.recorded)
      return (
        <View style={styles.recordPanel}>
          {this._renderRecordingIcon()}
          {this._renderStopIcon()}
        </View>
      );

    return (
      <View style={styles.recordPanel}>
        {
          (this.props.isRecording)
          ? this._renderRecordingIcon()
          : this._renderActiveRecording()
        }
        {
          (this.props.isRecording)
          ? this._renderActiveStop()
          : this._renderStopIcon()
        }
      </View>
    );
  }

}


class PlayPanel extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      recorded: this.props.recorded,
      isPlaying: false,
    };
  }

  _renderInactiveIcon = (iconName) => (
    <Icon 
      name={iconName} 
      style={styles.actionIcon} 
      color={Colors.grey400}
    />
  );

  _renderTouchableIcon = (iconName, method) => (
    <TouchableRipple
      onPress={method}
    >
      <Icon 
        name={iconName} 
        style={styles.actionIcon}
        color={Colors.red600}
        key={iconName}
      />
    </TouchableRipple>
  );

  _renderActiveIcons = () => (
    (this.state.isPlaying)
    ? [this._renderInactiveIcon("play"), this._renderTouchableIcon("pause")]
    : [this._renderTouchableIcon("play"), this._renderInactiveIcon("pause")]
  );

  _renderInactiveIcons = () => ([
    this._renderInactiveIcon("play"),
    this._renderInactiveIcon("pause")
  ]);

  render() {

    return (
      <View style={styles.playPanel}>
        {
          (this.state.recorded)
          ? this._renderActiveIcons()
          : this._renderInactiveIcons()
        }
      </View>
    );
  }

}

export default class RecordingTab extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      recorded: true,
      isRecording: false,
    };
  }

  render() {

    return (
      <Card style={styles.recordingTab}>
        <Card.Content
          style={styles.panel}
        >
          <RecordPanel 
            recorded={this.state.recorded}
            isRecording={this.state.isRecording}
          />
          <PlayPanel 
            recorded={this.state.recorded}
            isRecording={this.state.isRecording}
          />
        </Card.Content>
      </Card>
    );
  }

}

const styles = StyleSheet.create({
  recordingTab: {
    position: "absolute",
    zIndex: 2,
    bottom: 8,
    width: (Dimensions.get("window").width - 16),
    alignSelf: "center"
  },
  panel: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  recordPanel: {
    flexDirection: "row",
    borderColor: Colors.grey400,
    borderWidth: 2,
    padding: 2,
    borderRadius: 40,
  },
  playPanel: {
    flexDirection: "row",
    borderColor: Colors.grey400,
    borderWidth: 2,
    padding: 2,
    borderRadius: 40,
  },
  actionIcon: {
    fontSize: 30,
  },
});
