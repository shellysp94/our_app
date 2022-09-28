/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, {useState} from 'react';
import {View, Text, Button, Pressable} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../Styles/SignUpStyle';
import TInput from '../../Components/TInput';
import {useSelector, useDispatch} from 'react-redux';
import {
  updateConfiguration,
  updateOneSignUpConfig,
} from '../../store/Slices/configurationSlice';

function SignUp1({navigation}) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isFirstNameValid, setFirstNameValid] = useState(false);
  const [isLastNameValid, setLastNameValid] = useState(false);
  const [isEmailValid, setEmailValid] = useState(false);
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [continuePressed, setContinuePressed] = useState(false);
  const dispatch = useDispatch();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  day = day.toString().padStart(2, '0');
  month = month.toString().padStart(2, '0');
  var year = date.getFullYear();
  console.log(year);
  //--------------select values from state-------------
  const first_name = useSelector(
    state => state.configuration.signUpConfig?.first_name,
  );
  const last_name = useSelector(
    state => state.configuration.signUpConfig?.last_name,
  );
  const email = useSelector(state => state.configuration.signUpConfig?.email);
  const password = useSelector(
    state => state.configuration.signUpConfig?.password,
  );
  const city = useSelector(state => state.configuration.signUpConfig?.city);
  const profession = useSelector(
    state => state.configuration.signUpConfig?.profession,
  );
  const phone_number = useSelector(
    state => state.configuration.signUpConfig?.phone_number,
  );

  //-----------------VALIDATION functions------------------
  const validateEmail = val => {
    if (val.length === 0) {
      setEmailValid(false);
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(val) === false) {
        setEmailValid(false);
      } else {
        setEmailValid(true);
        setContinuePressed(false);
      }
    }
  };

  const validatePassword = val => {
    val.length === 0 ? setPasswordValid(false) : setPasswordValid(true);
  };
  const validateName = (name, setValid) => {
    if (name.length === 0) {
      setValid(false);
    } else if (!/[^a-zA-Z]/.test(name)) {
      setValid(true);
      setContinuePressed(false);
    } else {
      setValid(false);
    }
  };
  //--------------------------------------------------------
  let configuration = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    city: city,
    phone_number: phone_number,
    profession: profession,
    date_of_birth: `${day}-${month}-${year}`,
  };

  const onChangeDate = (event, selectedDate) => {
    setShow(false);
    setDate(selectedDate);
    dispatch(
      updateOneSignUpConfig({key: 'date_of_birth', value: selectedDate}),
    );
  };
  const updateState = () => {
    dispatch(updateConfiguration({signUpConfig: {...configuration}}));
  };

  //NOTICE: TInput is a component we created. TInput's code is located in the Components folder in file TInput.js file

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up 🥳</Text>
      <View style={styles.fullName}>
        <View style={styles.column}>
          <TInput
            style={styles.nameInput}
            value={first_name}
            title={'First Name'}
            onChangeText={val => {
              setContinuePressed(false);
              dispatch(updateOneSignUpConfig({key: 'first_name', value: val}));
              validateName(val, setFirstNameValid);
            }}
          />
          {continuePressed &&
          (first_name?.length === 0 || first_name === undefined) ? (
            <Text style={styles.inValidField}>required</Text>
          ) : (
            !isFirstNameValid &&
            continuePressed && (
              <Text style={styles.inValidField}>invalid first name</Text>
            )
          )}
        </View>
        <View style={styles.column}>
          <TInput
            style={styles.nameInput}
            value={last_name}
            title={'Last Name'}
            onChangeText={val => {
              setContinuePressed(false);
              dispatch(updateOneSignUpConfig({key: 'last_name', value: val}));
              validateName(val, setLastNameValid);
            }}
          />
          {continuePressed &&
          (last_name?.length === 0 || last_name === undefined) ? (
            <Text style={styles.inValidField}>required</Text>
          ) : (
            !isLastNameValid &&
            continuePressed && (
              <Text style={styles.inValidField}>invalid last name</Text>
            )
          )}
        </View>
      </View>
      <View style={styles.emailPassword}>
        <View style={styles.column}>
          <TInput
            style={styles.textInput}
            value={email}
            title={'Email'}
            onChangeText={val => {
              setContinuePressed(false);
              dispatch(updateOneSignUpConfig({key: 'email', value: val}));
              validateEmail(val);
            }}
          />
          {continuePressed && (email?.length === 0 || email === undefined) ? (
            <Text style={styles.invalidText}>required</Text>
          ) : (
            !isEmailValid &&
            continuePressed && (
              <Text style={styles.invalidText}>invalid email</Text>
            )
          )}
        </View>
        <TInput
          style={styles.textInput}
          value={password}
          title={'Password'}
          secureTextEntry={true}
          onChangeText={val => {
            setContinuePressed(false);
            dispatch(updateOneSignUpConfig({key: 'password', value: val}));
            validatePassword(val);
          }}
        />
        {continuePressed &&
        (password?.length === 0 || password === undefined) ? (
          <Text style={styles.invalidText}>required</Text>
        ) : (
          !isPasswordValid &&
          continuePressed && (
            <Text style={styles.invalidText}>invalid password</Text>
          )
        )}
      </View>
      <TInput
        style={styles.textInput}
        title={`Phone number`}
        onChangeText={val =>
          dispatch(updateOneSignUpConfig({key: 'phone_number', value: val}))
        }
      />
      <TInput
        style={styles.textInput}
        title={`City`}
        onChangeText={val =>
          dispatch(updateOneSignUpConfig({key: 'city', value: val}))
        }
      />
      <TInput
        style={styles.textInput}
        title={`Profession`}
        onChangeText={val =>
          dispatch(updateOneSignUpConfig({key: 'profession', value: val}))
        }
      />
      <View style={styles.birthday}>
        <Text style={styles.catagoryText}>birthday🎈🎉✨</Text>
        <Pressable style={styles.viewStyle} onPress={() => setShow(!show)}>
          <Text style={styles.dateText}>
            {day}-{month}-{year}
          </Text>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={'date'}
              is24Hour={true}
              onChange={onChangeDate}
            />
          )}
        </Pressable>
      </View>
      <View style={styles.ButtonSection1}>
        <Button
          color="#48D1CC"
          title="Continue"
          onPress={() => {
            setContinuePressed(true);
            updateState();

            if (
              isFirstNameValid &&
              isLastNameValid &&
              isEmailValid &&
              isPasswordValid
            ) {
              navigation.navigate('SignUp2');
            }
          }}
        />
      </View>
    </View>
  );
}

export default SignUp1;
