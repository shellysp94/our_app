/* eslint-disable no-unused-vars */
import {PermissionsAndroid} from 'react-native';
import {call, put, select} from 'redux-saga/effects';
import Geolocation from '@react-native-community/geolocation';
import {setMyLocation} from '../store/Slices/generalSlice';
import axios from 'axios';

const getUserId = state => state.configuration.userConfig.user_id;

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

const sendLocation = async (myUserId, mylongitude, mylatitude) => {
  console.log(`myLatitude: ${mylatitude}, myLongitude: ${mylongitude}`);
  return await axios.post(
    `http://192.168.1.141:3000/userLocation/${myUserId}`,
    {
      longitude: mylongitude,
      latitude: mylatitude,
    },
  );
};

export function* getCurrentLocationSaga() {
  const locationPermission = yield call(checkLocationPermission);
  const myUserId = yield select(getUserId);

  console.log('locationPermission: ', locationPermission);
  if (locationPermission === 'Permission Granted') {
    try {
      setInterval(async () => {
        const result = await getMyLocation();
        console.log(result);
        const newLocation = await sendLocation(
          myUserId,
          result.coords.longitude,
          result.coords.latitude,
        );
        console.log(newLocation.data);
        console.log('**2**');
      }, 10000);
    } catch (err) {
      console.log(err);
    }
  }
}
