/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {useState, useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from '../Styles/LogInStyle';
import axios from 'axios';
import TInput from '../Components/TInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogIn = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [deviceToken, setDeviceToken] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const baseUrl = 'http://192.168.1.141:3000/auth/login';
  const userConf = 'http://192.168.1.141:3000/userConfiguration/';
  const setsURL = 'http://192.168.1.141:3000/dataFromSetsToClient';

  const dispatch = useDispatch();
  const onLoadingPage = async event => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    //console.log('fcmtoken', fcmtoken);
    setDeviceToken(fcmtoken);

    const response = await axios.get(`${setsURL}`);
    dispatch({
      type: 'GET_RAW_TEXT',
      rawText: response.data,
    });
  };

  useEffect(() => {
    onLoadingPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateEmail = () => {
    // eslint-disable-next-line no-useless-escape
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
      console.log('TOKEN', deviceToken);
      const response = await axios.post(`${baseUrl}`, {
        email: email,
        password: password,
        device_token: deviceToken,
      });

      // eslint-disable-next-line no-prototype-builtins
      if (response.data.hasOwnProperty('msg')) {
        // eslint-disable-next-line no-alert
        alert(response.data.msg);
      } else {
        try {
          const getUser = await axios.get(
            `${userConf}${response.data.user_id}`,
            {
              headers: {
                Authorization: 'Bearer ' + response.data.token,
              },
            },
          );

          dispatch({
            type: 'UPDATE_DEATAILS',
            userConfig: getUser.data[0],
            email: response.data.email,
            fullName: `${getUser.data[0].first_name} ${getUser.data[0].last_name}`,
            token: response.data.token,
          });
          //console.log('Token', response.data.token);
          const socket = new WebSocket('ws://192.168.1.141:3000', null, {
            headers: {
              authorization: 'Bearer ' + response.data.token,
            },
          });
          socket.onopen = () => {
            // connection opened
            socket.send('something'); // send a message
          };
          //console.log(socket);
          navigation.navigate('HomeStack');
        } catch (error) {
          // eslint-disable-next-line no-alert
          alert(error);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
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
        <Pressable
          // style={({pressed}) => ({
          //   backgroundColor: pressed ? 'lightskyblue' : '#61AF9B',
          // })}
          onPress={reDirectToRegister}>
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
