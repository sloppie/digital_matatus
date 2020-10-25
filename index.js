/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Store, {
  Event,
  SEARCH_KEY_CHANGE, // for searchBar related Events
  CONFIG_COMPLETE, // complete configuration event
  MEDIA_UPLOADED, // uploading media on a claim
  MEDIA_DELETED, // deleting media when uploading a claim
  DESCRIPTION_LOADED,
  REPORT_FILED, // event for when a report is filed
  // WRITE_SUCCESS, // event fired when the the file is copied to the Pictures folder
} from './store';
// import NotificationSetup from './utilities/push-notifications';


const eventArr = [];

// initialise events
eventArr.push(new Event(SEARCH_KEY_CHANGE));
eventArr.push(new Event(CONFIG_COMPLETE));
eventArr.push(new Event(MEDIA_UPLOADED));
eventArr.push(new Event(MEDIA_DELETED));
eventArr.push(new Event(DESCRIPTION_LOADED));
eventArr.push(new Event(REPORT_FILED));
// eventArr.push(new Event(WRITE_SUCCESS));

// create the store
const APP_STORE = new Store(eventArr);

AppRegistry.registerComponent(appName, () => App);


export { APP_STORE };