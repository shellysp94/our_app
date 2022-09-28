import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken();
  }
}
const GetFCMToken = async () => {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');

  if (!fcmtoken) {
    try {
      fcmtoken = await messaging().getToken();
      await AsyncStorage.setItem('fcmtoken', fcmtoken);
    } catch (error) {
      console.log(error, 'error in fcmtoken');
    }
  }
};

export const NotificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log(
      'notification on froground state...........',
      JSON.stringify(remoteMessage, null, 2),
    );
  });
};
