/* eslint-disable no-unused-vars */
import {PermissionsAndroid} from 'react-native';
import {call, put} from 'redux-saga/effects';
import Geolocation from '@react-native-community/geolocation';
import {setMyLocation} from '../store/Slices/generalSlice';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const checkLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Access Required',
        message: 'This App needs to Access your location',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return 'Permission Granted';
    } else {
      return 'Permission Denied';
    }
  } catch (err) {
    console.warn(err);
  }
};

//FIX ME - change accurency to 5 meters
const getMyLocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export function* getCurrentLocationSaga() {
  const locationPermission = yield call(checkLocationPermission);
  console.log('locationPermission: ', locationPermission);
  if (locationPermission === 'Permission Granted') {
    console.log('1');
    const result = yield call(getMyLocation);
    console.log('PROMISE RESULT: ', result);
    yield put(
      setMyLocation({
        myLatitude: result.coords.latitude,
        myLongitude: result.coords.longitude,
      }),
    );

    console.log('4');
  }
}
