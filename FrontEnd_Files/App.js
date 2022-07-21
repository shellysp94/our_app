/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, {useEffect} from 'react';
import LogInScreen from './roots/root';
import {Provider} from 'react-redux';
import store from './store/store';
import {
  requestUserPermission,
  NotificationListener,
} from './utils/pushNotification_helper';
import WebSocketProvider from './utils/socketService';
// import {requestLocationPermission} from './utils/location';

// import Geolocation from '@react-native-community/geolocation';

// const location = async () => {
//   const position = await Geolocation.getCurrentPosition();
//   console.log('position', position);
// };

const App = () => {
  // const {currentLongitude, currentLatitude, locationStatus} = userLocation();
  // console.log('currentLongitude', currentLongitude);
  // console.log('currentLatitude', currentLatitude);
  // console.log('locationStatus', locationStatus);

  useEffect(() => {
    requestUserPermission();
    NotificationListener();
    //requestLocationPermission();
    // location();
  }, []);

  return (
    <Provider store={store}>
      <WebSocketProvider>
        <LogInScreen />
      </WebSocketProvider>
    </Provider>
  );
};

export default App;
