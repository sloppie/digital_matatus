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
} from './store';

const eventArr = [];

// initialise events
eventArr.push(new Event(SEARCH_KEY_CHANGE));
eventArr.push(new Event(CONFIG_COMPLETE));

// create the store
const APP_STORE = new Store(eventArr);

AppRegistry.registerComponent(appName, () => App);


export { APP_STORE };