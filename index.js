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
} from './store';
import NotificationSetup from './utilities/push-notifications';

const eventArr = [];

// initialise events
eventArr.push(new Event(SEARCH_KEY_CHANGE));
eventArr.push(new Event(CONFIG_COMPLETE));
eventArr.push(new Event(MEDIA_UPLOADED));
eventArr.push(new Event(MEDIA_DELETED));
eventArr.push(new Event(DESCRIPTION_LOADED));
eventArr.push(new Event(REPORT_FILED));

// create the store
const APP_STORE = new Store(eventArr);

// create NotificationToken to ease its fetching process
NotificationSetup.configure();

NotificationSetup.getNotificationId();

AppRegistry.registerComponent(appName, () => App);


export { APP_STORE };