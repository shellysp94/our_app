/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import styles from '../Styles/LogInStyle';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import TInput from '../Components/TInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {changeStatus, updateMyStatus} from '../store/Slices/generalSlice';
import {uploadMainImage} from '../store/Slices/picturesSlice';
import {
  updateDetails,
  clearSignUpConfig,
} from '../store/Slices/configurationSlice';
import {getCurrentPath} from '../utils/generalFunctions';
import {setMyLocation} from '../store/Slices/generalSlice';
import {getMyLocation, sendLocation} from '../utils/location';

const LogIn = ({navigation}) => {
  const path = getCurrentPath();
  const [email, setEmail] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const dispatch = useDispatch();
  const status = useSelector(state => state.general?.status);
  // const options = {
  //   enableHighAccuracy: false,
  //   timeout: 5000,
  //   maximumAge: 0,
  // };

  // const sendLocation = async (id, latitude, longitude, token) => {
  //   try {
  //     console.log(id, latitude, longitude, token);
  //     const res = await axios.post(
  //       `${path}/userLocation/${id}`,
  //       {
  //         longitude: longitude,
  //         latitude: latitude,
  //       },
  //       {
  //         headers: {
  //           Authorization: 'Bearer ' + token,
  //         },
  //       },
  //     );
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  // const getMyLocation = async () => {
  //   return new Promise((resolve, reject) => {
  //     Geolocation.getCurrentPosition(resolve, reject, options);
  //   });
  // };
  const getFcmToken = async event => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    setDeviceToken(fcmtoken);
  };

  useEffect(() => {
    getFcmToken();
  }, [dispatch]);

  const validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      setValidEmail(false);
    } else {
      setValidEmail(true);
    }
  };

  const handleEmail = value => {
    setEmail(value);
    validateEmail();
  };

  //NOTICE: The function handles user login to the system

  const onSubmitFormHandler = async () => {
    try {
      const response = await axios.post(`${path}/auth/login`, {
        email: email,
        password: password,
        device_token: deviceToken,
      });
      if (response.data.hasOwnProperty('msg')) {
        alert(response.data.msg);
      } else {
        try {
          const getUser = await axios.get(
            `${path}/userConfiguration/${response.data.user_id}`,
            {
              headers: {
                Authorization: 'Bearer ' + response.data.token,
              },
            },
          );
          dispatch(
            updateDetails({
              userConfig: getUser.data[0],
              email: response.data.email,
              fullName: `${getUser.data[0].first_name} ${getUser.data[0].last_name}`,
              token: response.data.token,
            }),
          );
          dispatch(updateMyStatus({status: getUser.data[0].user_status}));
          dispatch(uploadMainImage({uploadMainImage: getUser.data[0].image}));
          dispatch(changeStatus({status: 'connected'}));

          //------------------------------------------------------
          //get location

          const result = await getMyLocation();
          console.log(result.coords.longitude, result.coords.latitude);
          dispatch(
            setMyLocation({
              myLatitude: result.coords.longitude,
              myLongitude: result.coords.latitude,
            }),
          );

          await sendLocation(
            response.data.user_id,
            result.coords.longitude,
            result.coords.latitude,
            response.data.token,
          );
          //------------------------------------------------------

          navigation.navigate('HomeStack');
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const reDirectToRegister = () => {
    dispatch(clearSignUpConfig());
    navigation.navigate('SignUp');
  };
  if (status === 'accepted')
    return (
      <View style={styles.container}>
        <View style={styles.LogInForm}>
          <View style={{alignSelf: 'center', marginBottom: 30}}>
            <Image
              style={{height: 100, width: 250}}
              source={require(`../assets/Images/LOGO.png`)}
            />
          </View>
          <TInput
            title={'Email'}
            value={email}
            style={styles.textInput}
            secureTextEntry={false}
            onChangeText={value => handleEmail(value)}
          />
          <TInput
            title={'Password'}
            value={password}
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={styles.linkToRegister}>
          <Text style={styles.dontHaveAUser}>Don`t have a user? </Text>
          <Pressable onPress={reDirectToRegister}>
            <Text style={styles.createAnAcountText}>Create an account</Text>
          </Pressable>
        </View>
        <View style={styles.buttonSection}>
          <Pressable
            style={styles.button}
            disabled={!validEmail}
            onPress={() => {
              onSubmitFormHandler();
            }}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    );
  else {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
};

export default LogIn;
