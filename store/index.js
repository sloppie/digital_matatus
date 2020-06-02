import { DeviceEventEmitter } from 'react-native';

const SEARCH_KEY_CHANGE = "SEARCH_KEY_CHANGE";
const CONFIG_COMPLETE = "CONFIG_COMPLETE";
const MEDIA_UPLOADED = "MEDIA_UPLOADED";
const MEDIA_DELETED = "MEDIA_REMOVED";

// REPORT SCREEN
const DESCRIPTION_LOADED = "DESCRIPTION_LOADED";


/**
 * @description This is the class is used as a metaphorical store that takes in registered events, 
 * creates Events (uses the DeviceEventEmitter class to send out events).
 * Once the event is created, Components from the application can register to the event
 * to get updates. Once a Component registers for an Event, it also give the callback to
 * the action it wants carried out once this event happens.
 * This callbacks are the once stored and fired up once an event occurs to prevent making up of multiple
 * DeviceEventEitter events just to update each single component.
 * This also help to prevent over-subscription to a DeviceEventEmitter event (has a maximum of 10 subs)
 * 
 * @note all the events are registered in the index file so as to make the APP_STORE visible to all the
 * Components created in the application.
 */
export default class Store {

  constructor(evnts) {
    let regEvents = evnts

    this.events = {};

    regEvents.forEach(event => {
      this.events[event.name] = event;
    });

  }

  subscribe(eventName, action) {
    let eventKey = eventName.toUpperCase();
    let eventId = this.events[eventName].subscribe(action);

    return eventId;
  }

  unsubscribe(eventName, componentId) {
    this.events[eventName].unsubscribe(componentId);
  }

}


export class Event {

  constructor(name: string) {
    this.id = 1;
    this.eventName = name.toUpperCase();
    this.subscribedComponents = {};
    this.event = DeviceEventEmitter.addListener(this.eventName, this.actionCallback.bind(this));
  }

  get name() {

    return this.eventName;
  }

  subscribers() {
    let all = Object.keys(this.subscribedComponents);

    let active = [];

    all.forEach(sub => {

      if (typeof this.subscribedComponents[sub] == "function")
        active.push(sub);

    });

    return active;
  }

  get ID() {
    let pID = `${this.name}_${this.id}`;
    this.id++;

    return pID;
  }

  subscribe(action) {
    let componentId = this.ID;
    this.subscribedComponents[componentId] = action;

    return componentId;
  }

  unsubscribe(componentId) {
    this.subscribedComponents[componentId] = undefined;
  }

  isSubscriber(component) {
    let active = this.subscribers;
    let subscriber = (active.indexOf(component) !== -1);

    return subscriber;
  }

  actionCallback() {
    let followers = this.subscribers();

    for (let i = 0; i < followers.length; i++) {
      let sub = followers[i];
      let action = this.subscribedComponents[sub];
      action();
    }

  }

}

export {
  SEARCH_KEY_CHANGE, // may be used when signifying change in the values of the SearchBar
  CONFIG_COMPLETE, // used in the initial configuration to handle the user finishing initial app config
  MEDIA_UPLOADED, // used to monitor updates to the media the user has posted when posting a complaint
  MEDIA_DELETED, // used to notify that media has been deleted once a user does so
  DESCRIPTION_LOADED, // used to notify once the app fully renders the descriptions
};