/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Required for background/killed state on Android.
// Must be registered before AppRegistry.
messaging().setBackgroundMessageHandler(async () => {
  // FCM delivers the notification automatically via the 'notification' payload.
  // No manual handling needed here.
});

AppRegistry.registerComponent(appName, () => App);
