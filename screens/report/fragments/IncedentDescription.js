import React from 'react';
import { ScrollView, View, Dimensions, StyleSheet, ToastAndroid } from 'react-native';
import { Card, Divider, IconButton, Colors } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import ImagePicker from 'react-native-image-picker';
import Permissions from '../../../utilities/permissions';

let HarassmentDescription = null;
let RNThumbnail = null; // resuce the amount of modules loaded at start
let Thumbnails = null;


const media_types = {
  photo: "Photos",
  video: "video",
  audio: "audio"
}

export default class IncedentDescription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      date: new Date().toDateString(),
      description: "",
      verbalHarassmentFlags: [],
      "Verbal": false,
      "Non-verbal": false,
      "Physical": false,
      on: [],
      location: null,
      attachedPhotos: [], // stores the URIs for the attached media
      attachedPhotosThumbnails: [],
      attachedVideos: [],
      attachedVideosThumbnails: [],
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
    
    let descriptions = this.state.on.map((flag, index) => {

      if(flag == "Verbal")
        return (
          <HarassmentDescription 
            ref={this.VHFlag} 
            category="Verbal" 
            key={index.toString()}
          />
        )
        
      if(flag == "Non-verbal")
        return (
          <HarassmentDescription 
            ref={this.NVHFlag} 
            category="Non-verbal" 
            key={index.toString()}
          />
        );
  
      if(flag == "Physical")
        return (
          <HarassmentDescription 
            ref={this.PHFlag} 
            category="Physical" 
            key={index.toString()}
          />
        );

    });


    return descriptions;
  }

  _handleDescription = (description) => this.setState({description});

  _handleBlur = () => {
    this.props.setDescription(this.state.description);
  }

  // handle Location
  _handleLocation = async () => {
    
    if(this.state.location !== null) // prevents re-adding of location
      return;

    // REFACTOR!!!! BAD CODE WRITING
    if(Permissions.checkGeolocationPermission()) {
      Geolocation.getCurrentPosition(
        position => {
          if (position["coords"] == undefined)
            ToastAndroid.show("Make sure location services are turned on on your phone", ToastAndroid.SHORT);
          else {
            let { coords } = position;
            // console.log(JSON.stringify(coords.latitude, null, 2));
            let location = {
              latitude: coords.latitude,
              longitude: coords.longitude
            };

            console.log(`this is loc: ${location}`);
            this.setState({ location });
          }
        },
        err => ToastAndroid.show("Error adding location", ToastAndroid.SHORT),
        {enableHighAccuracy: true, timeout: 30000}
        );
    } else {
      let response = await Permissions.requestGeoLocationPermission();

      if (response) {
        Geolocation.getCurrentPosition(
          position => {
            if (position["coords"] == undefined)
              ToastAndroid.show("Make sure location services are turned on on your phone", ToastAndroid.SHORT);
            else {
              let { coords } = position;
              let location = {
                latitude: coords.latitude,
                longitude: coords.longitude
              };

              this.setState({location});
            }
          },
          err => ToastAndroid.show("Error adding location", ToastAndroid.SHORT),
          { enableHighAccuracy: true, timeout: 20000 }
        );
      } else {
        ToastAndroid.show("Service denied location access", ToastAndroid.SHORT);
      }

    }

    
  }

  // MEDIA SECTION

  // handle media
  _handleRecording = () => {
    console.log("User wants to record audio");
  }

  _handleMedia = async (type) => {
    let granted = await Permissions.checkReadExternalStoragePermission();

    if(!granted)
      granted = await Permissions.requestReadExternalStoragePermission();

    if(granted) {
      
      if(type == media_types.photo) {
        this._handlePhoto();
      } else if(type == media_types.video) {
        this._handleVideo();
      }
    } else {
      ToastAndroid.show("Access to internal storage needed for action", ToastAndroid.SHORT);
    }
  }

  _handlePhoto = () => {
    // check for storage read permission
      ImagePicker.showImagePicker(
        {
          title: "Image Picker",
          quality: 1.0,
          storageOptions: {
            skipBackup: true
          },
        },
        (response) => {
          
          if(response.didCancel) {
            console.log("User cancelled");
          } else if(response.error) {
            console.log("An error occured");
          } else {
            console.log(response.uri);
            
            if(this.state.attachedPhotos.indexOf(response.uri) == -1) { // only adds the uri of it predetermines that it wasnt added

              let {attachedPhotos, attachedPhotosThumbnails} = this.state;
              attachedPhotos.push(response.uri);
              attachedPhotosThumbnails.push(response.uri);

              this.setState({
                attachedPhotos: [...attachedPhotos],
                attachedPhotosThumbnails: [...attachedPhotosThumbnails],
              });
  
            }

          }

        }
      );
  }

  _handleVideo = () => {
    ImagePicker.launchImageLibrary(
      {
        title: "Video Picker",
        mediaType: "video",
        storageOptions: {
          skipBackup: true,
        },
      },
      (response) => {
        
        if(response.didCancel) {
          console.log("User cancelled");
        } else if(response.error) {
          console.log("Error ocurred");
        } else {
          
          if(this.state.attachedVideos.indexOf(response.uri) === -1) {
            /**
             * @todo handle files that do not have a 'path' identifier - they throw erros
             * @solution you could just refuse to show the thumbnail and claim it has a "problem"
             */
            console.log(`original path: ${response.path}`)
            
            if(RNThumbnail == null)
              RNThumbnail = require("react-native-thumbnail").default;
            
            RNThumbnail.get(`file://${response.path}`).then(result => {
              let attachedVideos = [...this.state.attachedVideos];
              let attachedVideosThumbnails = [...this.state.attachedVideosThumbnails];

              attachedVideos.push(response.uri);
              attachedVideosThumbnails.push(result.path);

              this.setState({attachedVideos, attachedVideosThumbnails})
            });
          }

        }

      }
    );
  }

  _removeMedia = (item, type) => {

    if(type == media_types.photo)
      this._removePhotos(item);
    else if(type == media_types.video)
      this._removeVideos(item);

  }

  _removePhotos = (item) => {
    let attachedPhotos = this.state.attachedPhotos.filter(media => media != item);
    let attachedPhotosThumbnails = this.state.attachedPhotosThumbnails.filter(media => media != item);

    this.setState({
      attachedPhotos,
      attachedPhotosThumbnails
    });
  }

  _removeVideos = (item) => {
    let attachedVideos = this.state.attachedVideos;
    let attachedVideosThumbnails = this.state.attachedVideosThumbnails;
    let removableIndex = attachedVideosThumbnails.indexOf(item); // index to be removed
    console.log(removableIndex);

    attachedVideos.splice(removableIndex, 1);
    attachedVideosThumbnails.splice(removableIndex, 1);

    this.setState({
      attachedVideos,
      attachedVideosThumbnails
    });
  }

  _renderThumbnails = (type) => {
    
    if(Thumbnails == null)
      Thumbnails = require("./Thumbnails").default;

    if(type === media_types.photo)
      return (
        <Thumbnails 
          thumbnails={this.state.attachedPhotos}
          removeMedia={this._removeMedia}
            type={media_types.photo}
        />
      );
    
    if(type === media_types.video)
        return (
          <Thumbnails 
            thumbnails={this.state.attachedVideosThumbnails}
            removeMedia={this._removeMedia}
            type={media_types.video}
          />
        );
  }

  // DATA COLLECTIONS
  _getSetFlags = () => {
    let categories = {};
    categories["Verbal"] = this.VHFlag.current._returnSetFlags();
    categories["Non-verbal"] = this.NVHFlag.current._returnSetFlags();
    categories["Physical"] = this.PHFlag.current._returnSetFlags();

    return categories;
  }

  render() {

    return (
      <ScrollView 
        style={styles.container}
      >
        <Card.Title 
          title={this.state.date} 
          subtitle="Timestamp added to the report"
        />
        <Divider />
        {this._generateFlags()}
        <View style={styles.iconContainer}>
          <IconButton
            icon="crosshairs-gps"
            onPress={this._handleLocation}
            color={(this.state.location !== null) ? Colors.green600: Colors.brown500}
            style={styles.mediaIcon}
          />
          <IconButton
            icon="microphone-outline"
            onPress={this._handleRecording}
            style={styles.mediaIcon}
          />
          <IconButton
            icon="video"
            onPress={this._handleMedia.bind(this, media_types.video)}
            style={styles.mediaIcon}
          />
        </View>
        <Divider />
        {this._renderThumbnails(media_types.photo)}
        {this._renderThumbnails(media_types.video)}
      </ScrollView>
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
