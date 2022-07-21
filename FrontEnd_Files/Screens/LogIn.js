/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from '../Styles/LogInStyle';
import axios from 'axios';
import TInput from '../Components/TInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {rawText, changeStatus} from '../store/Slices/generalSlice';
import {updateDetails} from '../store/Slices/configurationSlice';

const LogIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const dispatch = useDispatch();

  const onLoadingPage = async event => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    setDeviceToken(fcmtoken);

    const response = await axios.get(
      `http://192.168.1.141:3000/dataFromSetsToClient`,
    );
    dispatch(rawText({rawText: response.data}));
  };

  useEffect(() => {
    dispatch(changeStatus({status: 'disconnect'}));
    onLoadingPage();
  }, []);
  
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
  const onSubmitFormHandler = async event => {
    try {
      const response = await axios.post(
        `http://192.168.1.141:3000/auth/login`,
        {
          email: email,
          password: password,
          device_token: deviceToken,
        },
      );

      if (response.data.hasOwnProperty('msg')) {
        alert(response.data.msg);
      } else {
        try {
          const getUser = await axios.get(
            `http://192.168.1.141:3000/userConfiguration/${response.data.user_id}`,
            {
              headers: {
                Authorization: 'Bearer ' + response.data.token,
              },
            },
          );
          let details = {
            userConfig: getUser.data[0],
            email: response.data.email,
            fullName: `${getUser.data[0].first_name} ${getUser.data[0].last_name}`,
            token: response.data.token,
          };
          dispatch(updateDetails(details));
          dispatch(changeStatus({status: 'connected'}));
          navigation.navigate('HomeStack');
        } catch (error) {
          alert(error);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  const reDirectToRegister = () => {
    navigation.navigate('SignUp');
  };
  return (
    <View style={styles.container}>
      <View style={styles.LogInForm}>
        <Text style={styles.FormItemText}>Welcome</Text>
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
};

export default LogIn;
