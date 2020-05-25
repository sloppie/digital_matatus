import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Card, TextInput, IconButton } from 'react-native-paper';

let HarassmentDescription = null;

export default class IncedentDescription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      description: "",
      verbalHarassmentFlags: [],
      "Verbal": false,
      "Non-verbal": false,
      "Physical": false,
      on: []
    };

    // These refs are used to set the verbal harassment flags set by the user
    this.VHFlag = React.createRef();
    this.NVHFlag = React.createRef();
    this.PHFlag = React.createRef();
  }

  // this is used by the parent Component to turn the flags either on or off
  _turnFlag = (flag, value) => {
    let flags = {
      "Verbal": this.state.Verbal,
      "Non-verbal": this.state["Non-verbal"],
      "Physical": this.state.Physical
    };

    flags[flag] = value;
    let on = [];
    for(let i in flags) {
      
      if(flags[i])
        on.push(i);

    }

    this.setState({[flag]: value, on});
  }

  _generateFlags = () => {

    if(HarassmentDescription === null)
      HarassmentDescription = require("./HarassmentDescription").default;
    
    let descriptions = this.state.on.map(flag => {

      if(flag == "Verbal")
        return (<HarassmentDescription ref={this.VHFlag} category="Verbal" />)
        
      if(flag == "Non-verbal")
        return (<HarassmentDescription ref={this.NVHFlag} category="Non-verbal" />)
  
      if(flag == "Physical")
        return (<HarassmentDescription ref={this.PHFlag} category="Physical" />)

    });


    return descriptions;
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
        {
          this._generateFlags()
        }
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
