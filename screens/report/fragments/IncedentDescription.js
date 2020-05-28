import React from 'react';
import { ScrollView, View, Dimensions, StyleSheet, ToastAndroid, DeviceEventEmitter } from 'react-native';
import { Surface, Card, Divider, IconButton, Colors, Menu, RadioButton, List, Caption } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import AudioRecord from 'react-native-audio-record';
import ImagePicker from 'react-native-image-picker';
import Permissions from '../../../utilities/permissions';
import { APP_STORE } from '../../..';
import { MEDIA_DELETED, MEDIA_UPLOADED } from '../../../store';

let HarassmentDescription = null;
let RNThumbnail = null; // resuce the amount of modules loaded at start
let Thumbnails = null;
let RecordingTab = null;


const media_types = {
  photo: "Photos",
  video: "Video",
  audio: "audio"
}

const AUDIO_ATTACHED_DATA = [""];

// this might be liable to the RACE CONDITION 
AudioRecord.on("data", (data) => {
  new Promise((resolve, reject) => {
    try {
      AUDIO_ATTACHED_DATA[AUDIO_ATTACHED_DATA.length - 1] = AUDIO_ATTACHED_DATA[AUDIO_ATTACHED_DATA.length - 1].concat(data);
      resolve(true);
    } catch(err) {
      false;
    }
  });
});

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
      locationSet: false,
      attachedPhotos: [], // stores the URIs for the attached media
      attachedPhotosData: [],
      attachedPhotosThumbnails: [],
      attachedVideos: [],
      attachedVideosData: [],
      attachedVideosThumbnails: [],
      attachedAudios: [],
      attachedAudiosData: [],
      uploadCount: 0,
      recordingVisible: false,
      isRecording: false,
      audioRecorded: false,
      isPlaying: false,
      audio: null,
      audioData: "",
    };

    this.audio_count = 0;

    // These refs are used to set the verbal harassment flags set by the user
    this.VHFlag = React.createRef();
    this.NVHFlag = React.createRef();
    this.PHFlag = React.createRef();
  }

  async componentDidMount() {
    this.watchMediaUpload = APP_STORE.subscribe(MEDIA_UPLOADED, this.onMediaUpload.bind(this));

    let options = {
    };

  }

  componentWillUnmount() {
    // unsubscribe from all impending Events
    APP_STORE.unsubscribe(MEDIA_UPLOADED, this.watchMediaUpload);
  }

  // EVENT SUBSCRIPTIONS
  onMediaUpload = () => this.setState({uploadCount: (this.state.uploadCount + 1)});

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
    
    if(!this.state.on.length)
      return [];
    
    
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

            let location = {
              coordinates: {
                latitude: coords.latitude,
                longitude: coords.longitude
              }
            };

            console.log(`this is loc: ${location}`);
            this.setState({ location, locationSet: true });
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
                coordinates: {
                  latitude: coords.latitude,
                  longitude: coords.longitude
                }
              };

              this.setState({location, locationSet: true});
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

  _setLocationType = (value) => {

    // reduce animation delay
    requestAnimationFrame(() => {
      let location = {...this.state.location};
      location.type = value;
  
      this.setState({location});
  
      this.props.culpritDescriptionRef.current._setLocation(location.type);
    });
  }

  // MEDIA SECTION

  // handle media
  /**
   * @todo create a list view for the audio files also
   */
  _handleRecording = async () => {

    if(this.state.isRecording)
      return;

    AudioRecord.init({
      channels: 1,
      wavFile: `test_${this.audio_count}.wav`,
      bitsPerSample: 16,
      sampleRate: 16000,
    });


    this.audio_count++;

    let granted = await Permissions.checkAudioRecordingPermission();

    // REFACTOR!!!!
    if(granted) {
      ToastAndroid.show("Press the record button to start recording", ToastAndroid.SHORT);
      this.setState({recordingVisible: true});
      // this._recordAudio();
    } else {

      granted = await Permissions.requestAudioRecordingPermission();

      if(granted) {
        ToastAndroid.show("Press the record icon to start recording", ToastAndroid.SHORT);
        this.setState({recordingVisible: true});
      } else {
        ToastAndroid.show("Audio recording permissions needed for this action", ToastAndroid.SHORT);
      }

    }

  }

  // RECORDING
  _recordAudio = () => {
    this.setState({isRecording: true});
    AudioRecord.start();
    ToastAndroid.show("Tap the stop icon to stop recording", ToastAndroid.SHORT);
  }

  _stopRecording = async () => {
    let audio = await AudioRecord.stop();
    this.setState({audio, isRecording: false, audioRecorded: true});
    ToastAndroid.show("Tap the check icon to store recording", ToastAndroid.SHORT);
  }
  
  _playAudio = () => {}
  
  _pauseAudio = () => {}

  _okayRecording = () => {

    if(!this.state.audioRecorded)
      return;
    
    let attachedAudios = [...this.state.attachedAudios];
    AUDIO_ATTACHED_DATA.push(""); // creates new string to store a new set of data
    attachedAudios.push(this.state.audio);

    console.log(this.state.audioData);

    this.setState({
      attachedAudios,
      // RESET THE AUDIO TRACK CHANNEL
      isRecording: false,
      audioRecorded: false,
      isPlaying: false,
      audio: null,
      audioData: "",
      recordingVisible: false, // hide the recordingTab
    });
  }

  _handleMedia = async (type) => {
    const renderToast = () => ToastAndroid.show(`Loading ${type} library`, ToastAndroid.LONG);

    let granted = await Permissions.checkReadExternalStoragePermission();

    if(!granted)
      granted = await Permissions.requestReadExternalStoragePermission();

    if(granted) {
      renderToast();
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
      ImagePicker.launchImageLibrary(
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

              let {attachedPhotos, attachedPhotosData, attachedPhotosThumbnails} = this.state;
              attachedPhotos.push(response.uri);
              attachedPhotosData.push(response.data); // stores the responses data
              attachedPhotosThumbnails.push(response.uri);

              this.setState({
                attachedPhotosData: [...attachedPhotosData],
                attachedPhotos: [...attachedPhotos],
                attachedPhotosThumbnails: [...attachedPhotosThumbnails],
              });

              DeviceEventEmitter.emit(MEDIA_UPLOADED);
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
            console.log(`file metadata: ${JSON.stringify({uri: response.uri, originalUrl: response.origURL, path: response.path, fileName: response.fileName}, null, 2)}`);
            
            if(RNThumbnail == null) // lazy load the module
              RNThumbnail = require("react-native-thumbnail").default;
            
            let {path} = response;

            let updateState = (path=response.path) => {
              let attachedVideos = [...this.state.attachedVideos];
              let attachedVideosData = [...this.state.attachedVideosData];
              let attachedVideosThumbnails = [...this.state.attachedVideosThumbnails];
  
              attachedVideos.push(response.uri);
              attachedVideosData.push(response.data);
              attachedVideosThumbnails.push(path);
  
              this.setState({attachedVideos, attachedVideosThumbnails});
              DeviceEventEmitter.emit(MEDIA_UPLOADED);
            } 
            
            if(typeof path == "string") // this conditional was added because some files do not have original paths          
              RNThumbnail.get(`file://${response.path}`).then(result => {
                updateState(result.path);
              });
            else
              updateState(); // the content thumbnail is just added as null

          }

        }

      }
    );
  }

  _removeMedia = (item, type, index) => {

    if(type == media_types.photo)
      this._removePhotos(item, index);
    else if(type == media_types.video)
      this._removeVideos(item, index);

  }

  _removePhotos = (item, removableIndex) => {
    let attachedPhotos = [...this.state.attachedPhotos];
    let attachedPhotosData = [...this.state,attachedPhotosData];
    let attachedPhotosThumbnails = [...this.state.attachedPhotosThumbnails];

    // splice the data
    attachedPhotos.splice(removableIndex, 1);
    attachedPhotosData.splice(removableIndex, 1);
    attachedPhotosThumbnails.splice(removableIndex, 1);

    this.setState({
      attachedPhotos,
      attachedPhotosData,
      attachedPhotosThumbnails
    });
  }

  _removeVideos = (item, removableIndex) => {
    let attachedVideos = [...this.state.attachedVideos];
    let attachedVideosData = [...this.state.attachedVideosData];
    let attachedVideosThumbnails = [...this.state.attachedVideosThumbnails];

    attachedVideos.splice(removableIndex, 1);
    attachedVideosData.splice(removableIndex, 1);
    attachedVideosThumbnails.splice(removableIndex, 1);

    this.setState({
      attachedVideos,
      attachedVideosData,
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

  // inactive Renders
  _renderRecordingTab = () => {

    if(this.state.recordingVisible)
      return (
        <Surface
          style={styles.recordingTab}
        >
          <IconButton 
            icon="play" 
            style={styles.recordingButtons} size={30} 
            color={(!this.state.audioRecorded) ? Colors.grey400: Colors.red600}
            onPress={this._playAudio}
          />
          <IconButton 
            icon="pause" 
            style={styles.recordingButtons} 
            size={30} 
            color={(!this.state.audioRecorded) ? Colors.grey400: Colors.red600}
            onPress={this._pauseAudio}
          />
          <IconButton 
            icon="record" 
            style={styles.recordingIcon} 
            size={50} 
            color={(this.state.audioRecorded) ? Colors.grey400: Colors.red600}
            onPress={this._recordAudio}
          />
          <IconButton 
            icon="stop" 
            style={styles.recordingButtons} 
            size={30} 
            color={(!this.state.isRecording) ? Colors.grey400: Colors.red600}
            onPress={this._stopRecording}
          />
          <IconButton 
            icon="check" 
            style={styles.recordingButtons} 
            size={(this.state.audioRecorded) ? 50: 30} 
            color={(!this.state.audioRecorded) ? Colors.grey400: Colors.red600}
            onPress={this._okayRecording}
          />
        </Surface>
      );

  }

  _getInformation = () => {
    let {date, location, attachedAudios, attachedPhotosData, attachedVideosData, Verbal, Physical} = this.state;
    let nonVerbal = this.state["Non-verbal"];
    
    let response = {
      date,
      location,
      attachedAudiosData: AUDIO_ATTACHED_DATA, // attach the data itself instead of the file
      attachedPhotosData,
      attachedVideosData,
      flags: {}
    };

    if(Verbal) {
      response.flags["Verbal"] = this.VHFlag.current._returnSetFlags();
    }

    if(nonVerbal)
      response.flags["Non-verbal"] = this.NVHFlag.current._returnSetFlags();
    
    if(Physical)
      response.flags["Physical"] = this.PHFlag.current._returnSetFlags();
    
    return response;
  }

  _renderLocationRadio = () => (
    <RadioButton.Group
      onValueChange={this._setLocationType}
      value={this.state.location.type}
    >
      <Caption style={styles.radioButtonGroupCaption}>Give a brief location description</Caption>
      <List.Item 
        title="Bus Terminal"
        description="This happened on the matatu stage as you were about to pick up a bus"
        right={props => <RadioButton {...props} value="BUS_TERMINAL" />}
        onPress={this._setLocationType.bind(this, "BUS_TERMINAL")}
      />
      <List.Item 
        title="As you entered the bus"
        description="The matatu operator may have bloked your entrance as you were trying to enter the bus"
        right={props => <RadioButton {...props} value="ON_BUS_ENTRANCE" />}
        onPress={this._setLocationType.bind(this, "ON_BUS_ENTRANCE")}
      />
      <List.Item 
        title="Inside The Vehicle"
        description="This incident happened inside the bus"
        right={props => <RadioButton {...props} value="INSIDE_BUS" />}
        onPress={this._setLocationType.bind(this, "INSIDE_BUS")}
      />
      <Divider />
    </RadioButton.Group>
  );

  render() {

    return (
      <>
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
              icon="image"
              onPress={this._handleMedia.bind(this, media_types.photo)}
              style={styles.mediaIcon}
            />
            <IconButton
              icon="video"
              onPress={this._handleMedia.bind(this, media_types.video)}
              style={styles.mediaIcon}
            />
          </View>
          <Divider />
          {this.state.locationSet ? this._renderLocationRadio(): null}
          {this._renderThumbnails(media_types.photo)}
          <Divider />
          {this._renderThumbnails(media_types.video)}
          <Divider />
        </ScrollView>
        {(this.state.recordingVisible)? this._renderRecordingTab(): null}
      </>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1
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
  recordingTab: {
    position: "absolute",
    alignSelf: "center",
    width: Dimensions.get("window").width,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    elevation: 3
  },
  recordingButtons: {
    margin: 0,
    padding: 0,
  },
  recordingIcon: {
    fontSize: 50,
  },
  radioButtonGroupCaption: {
    paddingLeft: 16,
    textAlignVertical: "center",
    fontWeight: "700"
  },
});
