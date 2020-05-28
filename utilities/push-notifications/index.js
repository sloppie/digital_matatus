import AsyncStorage from "@react-native-community/async-storage";

import { Notifications } from 'react-native-notifications';

export default class NotificationSetup {

  static configure() {

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      console.log("Device Notification token: " + event.deviceToken);

      AsyncStorage.setItem("deviceNotificationToken", JSON.stringify(event.deviceToken));
    });

    Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.log(event);
    });

    Notifications.registerRemoteNotifications();
  }

  static handleNotification() {
    // application once the app is active
    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(notification.payload);

      completion({alert: true, sound: true, badge: false});
    });

    // application once the app is dead or in pause
    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
      console.log(notification.payload);

      completion({alert: true, sound: true, badge: false});
    });

    // notification has been opened
    Notifications.events().registerNotificationOpened((notification, completion, action) => {
      console.log(notification.payload);

      completion();
    });
  }

}