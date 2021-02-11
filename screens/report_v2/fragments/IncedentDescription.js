import React from 'react';
import { 
  Text,
  ScrollView, 
  Dimensions, 
  StyleSheet, 
  ToastAndroid, 
  DeviceEventEmitter, 
} from 'react-native';

import { 
  Surface,
  Card,
  Divider,
  IconButton,
  Colors,
  RadioButton,
  List,
  Caption,
  FAB,
} from 'react-native-paper';

import Geolocation from '@react-native-community/geolocation';
import AudioRecord from 'react-native-audio-record';
import {launchImageLibrary} from 'react-native-image-picker';
import Permissions from '../../../utilities/permissions';
import { APP_STORE } from '../../..';
import { MEDIA_UPLOADED, DESCRIPTION_LOADED } from '../../../store';
import Theme from '../../../theme';
import * as FileManager from '../../../utilities/file_manager';

let RNThumbnail = null; // resuce the amount of modules loaded at start
let Thumbnails = null;


const media_types = {
  photo: "photo",
  video: "Video",
  audio: "audio"
}

const AUDIO_ATTACHED_DATA = [];

// this might be liable to the RACE CONDITION 
AudioRecord.on("data", (data) => {
  new Promise((resolve, reject) => {
    try {
      AUDIO_ATTACHED_DATA[AUDIO_ATTACHED_DATA.length - 1] = AUDIO_ATTACHED_DATA[AUDIO_ATTACHED_DATA.length - 1].concat(data);
      resolve(true);
    } catch(err) {
      // console.log(err);
      false;
    }
  });
});

export default class IncedentDescription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      date: new Date().getTime(),
      description: "",
      discriminationCategory: "",
      verbalHarassmentFlags: [],
      "Verbal": false,
      "Non-verbal": false,
      "Physical": false,
      on: [],
      descriptionLoaded: false,
      location: null,
      locationSet: false,
      attachedPhotos: [], // stores the URIs for the attached media
      attachedPhotosThumbnails: [],
      attachedVideos: [],
      attachedVideosThumbnails: [],
      attachedAudios: [],
      uploadCount: 0,
      recordingVisible: false,
      isRecording: false,
      audioRecorded: false,
      isPlaying: false,
      audio: null,
      audioData: "",
      attachOpen: false,
    };

    this.audio_count = 0;
    this.descriptions = [];
  }

  componentDidMount() {
    this.watchMediaUpload = APP_STORE.subscribe(MEDIA_UPLOADED, this.onMediaUpload.bind(this));
    this.descriptionLoaded = APP_STORE.subscribe(DESCRIPTION_LOADED, this.setDescriptionLoad.bind(this, true));
    // this.writeSuccess = APP_STORE.subscribe(FileManager.WRITE_SUCCESS, this.onWriteSuccess);
    this.cameraPayloadSubscription = DeviceEventEmitter.addListener(
      FileManager.WRITE_SUCCESS(), // WRITE SUCCESS Event
      this.onWriteSuccess.bind(this) // callback on successfull write
    );

    this._handleLocation();

  }

  componentWillUnmount() {
    // unsubscribe from all impending Events
    APP_STORE.unsubscribe(MEDIA_UPLOADED, this.watchMediaUpload);
    APP_STORE.unsubscribe(DESCRIPTION_LOADED);
  }

  onWriteSuccess(fileLocation, mediaType) {
    let fileUri = `${fileLocation}`;
    this._addMediaFile(fileUri, mediaType);
  }

  _addMediaFile = async (fileUri, mediaType) => {
    console.log("File URI\n" + FileManager.getMimeTypeFromExtension(fileUri));
    if(FileManager.IMAGE() === mediaType) {
      let attachedPhotos = [...this.state.attachedPhotos];
      let attachedPhotosThumbnails = [...this.state.attachedPhotosThumbnails];

      attachedPhotos.push(fileUri);
      attachedPhotosThumbnails.push(fileUri);

      setTimeout(() => this.setState({
        attachedPhotos,
        attachedPhotosThumbnails,
      }), 1000);

    } else {
      /**@type Array<string> */
      let attachedVideos = [...this.state.attachedVideos];
      /**@type Array<string> */
      let attachedVideosThumbnails = [...this.state.attachedVideosThumbnails];

      attachedVideos.push(fileUri);

      if(RNThumbnail == null)
        RNThumbnail = require('react-native-thumbnail').default;

      try {
        let {path} = await RNThumbnail.get(fileUri);
        attachedVideosThumbnails.push(path);
      } catch (err) {
        attachedVideosThumbnails.push(fileUri);
      }

      setTimeout(() => this.setState({
        attachedVideos,
        attachedVideosThumbnails
      }), 1000);
    }
  }

  // EVENT SUBSCRIPTIONS
  onMediaUpload = () => this.setState({uploadCount: (this.state.uploadCount + 1)});

  // this is used by the parent Component to turn the flags either on or off
  _turnFlag = (flag, value, discriminationCategory) => {
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

    this.setState({[flag]: value, on, discriminationCategory});
  }

  setDescriptionLoad = (descriptionLoaded) => this.setState({descriptionLoaded});

  _handleDescription = (description) => this.setState({description});

  _handleBlur = () => {
    this.props.setDescription(this.state.description);
  }

  // handle Location
  _handleLocation = async () => {
    
    if(this.state.location !== null) // prevents re-adding of location
      return;

    ToastAndroid.show("Fetching location", ToastAndroid.SHORT);
    /** @todo REFACTOR!!!! BAD CODE WRITING */
    if(Permissions.checkGeolocationPermission()) {
      Geolocation.getCurrentPosition(
        position => {
          if (position["coords"] == undefined) {
            // ToastAndroid.show("Make sure location services are turned on on your phone", ToastAndroid.SHORT);
            this.props.showSnackBar(
              "Error pinning location, check your internet connection and ensure location services are turned on");
          } else {
            // ToastAndroid.show("Location pinned successfully", ToastAndroid.SHORT);
            this.props.showSnackBar(
              "Location Pinned successfully");
            let { coords } = position;

            let location = {
              coordinates: {
                latitude: coords.latitude,
                longitude: coords.longitude
              }
            };

            // console.log(`this is loc: ${location}`);
            this.setState({ location, locationSet: true });
          }
        },
        err => this.props.showSnackBar("Error pinning location, check your internet connection and ensure location services are turned on"),
        {enableHighAccuracy: true, timeout: 30000}
        );
    } else {
      let response = await Permissions.requestGeoLocationPermission();

      if (response) {
        Geolocation.getCurrentPosition(
          position => {
            if (position["coords"] == undefined) {
              // ToastAndroid.show("Make sure location services are turned on on your phone", ToastAndroid.SHORT);
              this.props.showSnackBar(
                "Error pinning location, please make sure location services is turned on and that you have access to a working internet connection");
            }
            else {
              // ToastAndroid.show("Location pinned successfully", ToastAndroid.SHORT);
              this.props.showSnackBar(
                "Location Pinned successfully");
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
          err => this.props.showSnackBar("Error pinning location, please make sure location services is turned on and that you have access to a working internet connection"),
          { enableHighAccuracy: true, timeout: 20000 }
        );
      } else {
        // ToastAndroid.show("Service denied location access", ToastAndroid.SHORT);
        this.props.showSnackBar("Service denied, Location access is not allowed for this application");
      }

    }
    
  }

  _setLocationType = (value) => {

    // reduce animation delay
    requestAnimationFrame(() => {
      let location = {...this.state.location};
      location.type = value;
  
      this.setState({location});
      ToastAndroid.show("Location Pinned", ToastAndroid.SHORT);
  
      this.props.culpritDescriptionRef.current._setLocation(location.type);
    });
  }

  // MEDIA SECTION

  // handle media
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
    if(!AUDIO_ATTACHED_DATA.length)
      AUDIO_ATTACHED_DATA.push("");

    this.setState({isRecording: true});
    AudioRecord.start();
    ToastAndroid.showWithGravity("Tap the stop icon to stop recording", ToastAndroid.SHORT, ToastAndroid.TOP);
  }

  _stopRecording = async () => {
    let audio = await AudioRecord.stop();
    this.setState({audio, isRecording: false, audioRecorded: true});
    ToastAndroid.showWithGravity("Tap the check icon to store recording", ToastAndroid.SHORT, ToastAndroid.TOP);
  }
  
  _playAudio = () => {}
  
  _pauseAudio = () => {}

  _okayRecording = () => {

    if(!this.state.audioRecorded)
      return;
    
    let attachedAudios = [...this.state.attachedAudios];
    attachedAudios.push(`file://${this.state.audio}`);

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

  _findFileExtension = (uri, type) => {
    let isFileUri = new RegExp("file://").test(uri);
    let extension = "";
    let extensions = {
      [media_types.video]: ["mpeg4", "mp4"],
      [media_types.photo]: ["jpeg", "jpg", "png"],
      [media_types.audio]: ["wav"]
    };


    let validExtensions = extensions[type];

    if(isFileUri) {
      extension = uri.split(".").pop(); // the last stored is def the extension
    } else {

      for(let i=0; i<validExtensions.length; i++) {
        let found = new RegExp(validExtensions[i]).test(uri);

        if(found){
          extension = validExtensions[i];
          break;
        }

      }

    }

    return extension;
  }

  _handleMedia = async (type) => {
    console.log("Handling " + type + " Picker");
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
    console.log("_handlePhoto method called");
      launchImageLibrary(
        {
          mediaType: "photo",
          quality: 1.0,
          storageOptions: {
            skipBackup: true
          },
          maxWidth: 1000,
          maxHeight: 1000,
          includeBase64: false,
        },
        (response) => {
          console.log("Did respond")
          
          if(response.didCancel) {
            console.log("User cancelled");
          } else if(response.error) {
            console.log("An error occured");
          } else {
            console.log(response.uri);
            
            if(this.state.attachedPhotos.indexOf(response.uri) == -1) { // only adds the uri of it predetermines that it wasnt added

              let {
                attachedPhotos, 
                attachedPhotosThumbnails, 
              } = this.state;
              attachedPhotos.push(response.uri);
              attachedPhotosThumbnails.push(response.uri);

              this.setState({
                attachedPhotos: [...attachedPhotos],
                attachedPhotosThumbnails: [...attachedPhotosThumbnails],
              });

              console.log(JSON.stringify(this.state.attachedPhotos, null, 2))
              DeviceEventEmitter.emit(MEDIA_UPLOADED);
            }

          }

        }
      );
  }

  _handleVideo = () => {

    launchImageLibrary(
      {
        title: "Video Picker",
        mediaType: "video",
        storageOptions: {
          skipBackup: true,
        },
      },
      (response) => {
        
        if(response.didCancel) {
          // console.log("User cancelled");
        } else if(response.error) {
          // console.log("Error ocurred");
        } else {
          
          if(this.state.attachedVideos.indexOf(response.uri) === -1) {
            /**
             * @todo handle files that do not have a 'path' identifier - they throw erros
             * @solution you could just refuse to show the thumbnail and claim it has a "problem"
             */
            
            if(RNThumbnail == null) // lazy load the module
              RNThumbnail = require("react-native-thumbnail").default;
            
            let {path} = response;

            let updateState = (path=response.path) => {
              let attachedVideos = [...this.state.attachedVideos];
              let attachedVideosThumbnails = [...this.state.attachedVideosThumbnails];
  
              attachedVideos.push(response.uri);
              attachedVideosThumbnails.push(path);

              this.setState({
                attachedVideos, 
                attachedVideosThumbnails,
              });

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
    else if(type == media_types.audio)
      this._removeAudios(item, index);

  }

  _removePhotos = (item, removableIndex) => {
    let attachedPhotos = [...this.state.attachedPhotos];
    let attachedPhotosThumbnails = [...this.state.attachedPhotosThumbnails];

    // splice the data
    attachedPhotos.splice(removableIndex, 1);
    attachedPhotosThumbnails.splice(removableIndex, 1);

    this.setState({
      attachedPhotos,
      attachedPhotosThumbnails,
    });
  }

  _removeVideos = (item, removableIndex) => {
    let attachedVideos = [...this.state.attachedVideos];
    let attachedVideosThumbnails = [...this.state.attachedVideosThumbnails];

    attachedVideos.splice(removableIndex, 1);
    attachedVideosThumbnails.splice(removableIndex, 1);

    this.setState({
      attachedVideos,
      attachedVideosThumbnails,
    });
  }

  _removeAudios = (item, removableIndex) => {
    let attachedAudios = [...this.state.attachedAudios];
    attachedAudios.splice(removableIndex, 1);

    this.setState({
      attachedAudios,
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

    if(type === media_types.audio)
      return (
        <Thumbnails 
          thumbnails={this.state.attachedAudios}
          removeMedia={this._removeMedia}
          type={media_types.audio}
        />
      );
  }

  // DATA COLLECTIONS

  // inactive Renders
  _renderRecordingTab = () => {

    if(this.state.recordingVisible)
      return (
        <Surface
          style={styles.recordingTab}
        >
          {/* <IconButton 
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
          /> */}
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

  createFileObjects(type) {
    let extensions, fileData, uris;

    switch(type) {
      case media_types.audio:
        uris = this.state.attachedAudios;
        break;
      case media_types.photo:
        uris = this.state.attachedPhotos;
        break;
      case media_types.video:
        uris = this.state.attachedVideos;
        break;
    }

    let fileObjects = uris.map((uri, index) => {
      return {
        uri,
      };
    });

    return fileObjects;
  }

  _getInformation = () => {
    let {date, location} = this.state;
    
    let response = {
      date,
      location,
      attachedAudiosData: this.createFileObjects(media_types.audio), // attach the data itself instead of the file
      attachedPhotosData: this.createFileObjects(media_types.photo),
      attachedVideosData: this.createFileObjects(media_types.video),
      // flags: {}
    };
    
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
        right={props => <RadioButton {...props} color="purple" value="BUS_TERMINAL" />}
        onPress={this._setLocationType.bind(this, "BUS_TERMINAL")}
      />
      <List.Item 
        title="As you entered the bus"
        description="The matatu operator may have bloked your entrance as you were trying to enter the bus"
        right={props => <RadioButton {...props} color="purple" value="ON_BUS_ENTRANCE" />}
        onPress={this._setLocationType.bind(this, "ON_BUS_ENTRANCE")}
      />
      <List.Item 
        title="Inside The Vehicle"
        description="This incident happened inside the bus"
        right={props => <RadioButton {...props} color="purple" value="INSIDE_BUS" />}
        onPress={this._setLocationType.bind(this, "INSIDE_BUS")}
      />
      <Divider />
    </RadioButton.Group>
  );

  _toggleFABState = (attachOpen) => this.setState({attachOpen});

  /**
   * Loads up the camera after the action is started from the FAB.Group component. Loads up either
   * to take a `video` or `camera` (picture)
   *
   * @param {"camera" | "video"} type this is the type of media that will be taken using the camera
   */
  _handleCamera = (type) => {
    DeviceEventEmitter.emit("LAUNCH_CAMERA", type);
  }

  actions = [
    {
      icon: "camera-outline", 
      label: "Take Picture", 
      color: Colors.red800, 
      onPress: this._handleCamera.bind(this, "camera"),
    },
    {
      icon: "video-outline", 
      label: "Take Video", 
      color: Colors.red800, 
      onPress: this._handleCamera.bind(this, "video"),
    },
    {
      icon: "crosshairs-gps", 
      label: "Attach location", 
      color: Colors.red800, 
      onPress: this._handleLocation
    },
    {
      icon: "microphone-outline", 
      label: "Attach recording", 
      // color: Colors.brown500, 
      onPress: this._handleRecording
    },
    {
      icon: "image", 
      label: "Attach photo", 
      color: Colors.brown500, 
      onPress: this._handleMedia.bind(this, media_types.photo)
    },
    {
      icon: "video", 
      label: "Attach video", 
      onPress: this._handleMedia.bind(this, media_types.video)
    },
  ];

  render() {

    return (
      <>
        <ScrollView 
          style={styles.container}
        >
          <Text style={styles.screenTitle}>Attach Media</Text>
            <Caption style={styles.screenCaption}>
              In this section, you will attach all available media you have pertaining to the incident
            </Caption>
          <Card
            style={styles.timestampCard}
            theme={Theme.AppTheme}
          >
          <Card.Title 
            left={props => <List.Icon {...props} style={styles.timestampCardTitleLeft} icon="calendar-clock" />}
            title={new Date(this.state.date).toDateString()} 
            titleStyle={styles.timestampCardTitle}
            subtitle="Timestamp added to the report"
          />
          </Card>
          {/* <Divider /> */}
          {this.state.locationSet && this._renderLocationRadio()}
          {this._renderThumbnails(media_types.photo)}
          <Divider />
          {this._renderThumbnails(media_types.video)}
          <Divider />
          {this._renderThumbnails(media_types.audio)}
        </ScrollView>
        {(this.state.recordingVisible) && this._renderRecordingTab()}
        <FAB.Group
          onStateChange={this._toggleFABState.bind(this, !this.state.attachOpen)}
          onPress={this._toggleFABState.bind(this, !this.state.attachOpen)}
          open={this.state.attachOpen}
          icon="paperclip"
          actions={this.actions}
          color="#707070"
          fabStyle={{backgroundColor: "orange"}}
          style={styles.fabGroup}
        />
      </>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    // backgroundColor: "white",
  },
  screenTitle: {
    fontSize: 48,
    fontFamily: Theme.OpenSansBold,
    marginStart: 16,
  },
  screenCaption: {
    marginStart: 16,
    marginBottom: 8,
  },
  timestampCard: {
    width: (Dimensions.get("window").width - 32),
    backgroundColor: "pink",
    alignSelf: "center",
    color: "purple",
    borderRadius: 4,
  },
  timestampCardTitle: {
    color: "purple",
  },
  timestampCardTitleLeft: {
    color: "purple",
    backgroundColor: "white",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "purple",
  },
  textInput: {
    width: (Dimensions.get("window").width - 32),
    alignSelf: "center",
  },
  iconContainer: {
    width: (Dimensions.get("window").width),
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: Theme.PrimaryColor
  },
  mediaIcon: {
    // marginEnd: 16,
    backgroundColor: "white",
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
    zIndex: 4,
    elevation: 10,
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
  fabGroup: {
    position: "absolute",
    // marginBottom: 16,
  },
});
