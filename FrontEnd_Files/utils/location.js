/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function userLocation() {
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');

  console.log('currentLongitude: ', currentLongitude);
  console.log('currentLatitude: ', currentLatitude);
  console.log('locationStatus: ', locationStatus);

  return {currentLongitude, currentLatitude, locationStatus};
}
export const getOneTimeLocation = () => {
  setLocationStatus('Getting Location ...');
  Geolocation.getCurrentPosition(
    //Will give you the current location
    position => {
      setLocationStatus('You are Here');
      const currentLongitude = JSON.stringify(position.coords.longitude);
      const currentLatitude = JSON.stringify(position.coords.latitude);
      setCurrentLongitude(currentLongitude);
      setCurrentLatitude(currentLatitude);
    },
    error => {
      setLocationStatus(error.message);
    },
    {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 1000,
    },
  );
};

export const subscribeLocationLocation = () => {
  watchID = Geolocation.watchPosition(
    position => {
      setLocationStatus('You are Here');
      console.log(position);

      const currentLongitude = JSON.stringify(position.coords.longitude);
      const currentLatitude = JSON.stringify(position.coords.latitude);

      setCurrentLongitude(currentLongitude);
      setCurrentLatitude(currentLatitude);
    },
    error => {
      setLocationStatus(error.message);
    },
    {
      enableHighAccuracy: false,
      maximumAge: 1000,
    },
  );
};

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Access Required',
        message: 'This App needs to Access your location',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //To Check, If Permission is granted
      getOneTimeLocation();
      subscribeLocationLocation();
    } else {
      setLocationStatus('Permission Denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
