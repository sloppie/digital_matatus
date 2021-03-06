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

  static async checkGeolocationPermission() {
    let response = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    return response;
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

  static async checkCameraAccessPermission() {
    let response = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

    return response;
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
  
  static async checkAudioRecordingPermission() {
    let response = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

    return response;
  }

  static async requestWriteToExternalStoragePermission() {
    let response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Write to storage",
        message: "This may help when reporting incidences were picture or video evidence is not available and stored on your phone",
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

  static async checkWriteToExternalStoragePermission() {
    let response = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

    return response;
  }

  static async requestReadExternalStoragePermission() {
    let response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Read storage",
        message: "This may help when reporting incidences were picture or video evidence is not available and stored on your phone",
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

  static async checkReadExternalStoragePermission() {
    let response = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

    return response;
  }

  static async requestAllPermissions() {
    let response = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]
    );

    return response;
  }

}