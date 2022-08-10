/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import {PermissionsAndroid} from 'react-native';
import {call, put, select} from 'redux-saga/effects';
import Geolocation from '@react-native-community/geolocation';
import {setMyLocation} from '../store/Slices/generalSlice';
import axios from 'axios';

const getMyLatitude = state => state.general.myLatitude;
const getMyLongitude = state => state.general.myLongitude;
const getUserId = state => state.configuration.userConfig.userId;

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

export const getMyLocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
};
export function* getCurrentLocationSaga() {
  const locationPermission = yield call(checkLocationPermission);
  const myUserId = yield select(getUserId);

  console.log('locationPermission: ', locationPermission);
  if (locationPermission === 'Permission Granted') {
    setInterval(async () => {
      console.log('*****');
      const result = await getMyLocation();
      console.log(
        `myLatitude: ${result.coords.latitude}, myLongitude: ${result.coords.longitude}`,
      );
      axios.post(`http://192.168.1.141:3000/userLocation/${myUserId}`, {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      });
    }, 10000);
  }
}
