import { PermissionsAndroid } from 'react-native';

export default class Permissions {

  static async requestGeoLocationPermission() {
    let response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Access User Location",
        message: "This request helps when helping the user access location sensitive services such as:\n1. Nearest station check\n2. Reporting incidences",
        buttonNeutral: "Ask me later",
        buttonNegative: "No",
        buttonPositive: "Grant"
      }
    );

    if(response == PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }

  }

  static async requestCameraAccessPermission() {
    let response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera access request",
        message: "This application requires access to the Camera to help take photographic evidence of incedences (where possible) to help build a stringer case while reporting the incidence.",
        buttonNeutral: "Ask Later",
        buttonNegative: "No",
        buttonPositive: "Grant"
      }
    );

    if(response == PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }

  }

  static async requestAudioRecordingPermission() {
    let response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Audio recording permission",
        message: "This may help when reporting incidences were picture or video evidence is not available",
        buttonNeutral: "Ask me later",
        buttonNegative: "No",
        buttonPositive: "Grant"
      }
    );
    
    if(response == PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }

  }

  static async requestAllPermissions() {
    let response = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]
    );

    return response;
  }

}