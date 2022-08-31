/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, {useState} from 'react';
import {View, Text, ScrollView, Button, Pressable} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../Styles/SignUpStyle';
import TInput from '../../Components/TInput';
import {useSelector, useDispatch} from 'react-redux';
import {updateConfiguration} from '../../store/Slices/configurationSlice';

function SignUp1({navigation}) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const signUpConfig = useSelector(state => state.configuration.signUpConfig);

  const [isFirstNameValid, setFirstNameValid] = useState(true);
  const [isLastNameValid, setLastNameValid] = useState(true);
  const [isEmailValid, setEmailValid] = useState(true);
  const dispatch = useDispatch();
  var day = date.getDate();
  var month = date.getMonth() + 1;
  day = day.toString().padStart(2, '0');
  month = month.toString().padStart(2, '0');
  // console.log('-------SignUp1-------');
  // console.log(signUpConfig);

  var year = date.getFullYear();
  const onChangeDate = (event, selectedDate) => {
    setShow(false);
    setDate(selectedDate);
  };

  const validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  };

  const validateName = (name, setValid) => {
    if (!/[^a-zA-Z]/.test(name)) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  let configuration = {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: `${day}-${month}-${year}`,
    city: city,
    phone_number: phoneNumber,
    profession: profession,
  };

  const updateState = () => {
    dispatch(updateConfiguration({signUpConfig: {...configuration}}));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up 🥳</Text>
      <ScrollView style={styles.scroll}>
        <View style={styles.fullName}>
          <View style={styles.column}>
            <TInput
              style={styles.nameInput}
              value={firstName}
              title={'First Name'}
              onChangeText={val => {
                setFirstName(val);
                validateName(val, setFirstNameValid);
              }}
            />
            {!isFirstNameValid && (
              <Text style={styles.notValidField}>not valid</Text>
            )}
          </View>
          <View style={styles.column}>
            <TInput
              style={styles.nameInput}
              value={lastName}
              title={'Last Name'}
              onChangeText={val => {
                setLastName(val);
                validateName(val, setLastNameValid);
              }}
            />
            {!isLastNameValid && (
              <Text style={styles.notValidField}>not valid</Text>
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
                setEmail(val);
                validateEmail(val);
              }}
            />
            {!isEmailValid && <Text style={styles.invalidText}>invalid</Text>}
          </View>
          <TInput
            style={styles.textInput}
            value={password}
            title={'Password'}
            secureTextEntry={true}
            onChangeText={val => {
              setPassword(val);
            }}
          />
        </View>
        <TInput
          style={styles.textInput}
          title={`Phone number`}
          onChangeText={val => setPhoneNumber(val)}
        />
        <TInput
          style={styles.textInput}
          title={`City`}
          onChangeText={val => setCity(val)}
        />
        <TInput
          style={styles.textInput}
          title={`Profession`}
          onChangeText={val => setProfession(val)}
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
                mode={mode}
                is24Hour={true}
                onChange={onChangeDate}
              />
            )}
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.ButtonSection1}>
        <Button
          color="#48D1CC"
          title="Continue"
          onPress={() => {
            updateState();
            navigation.navigate('SignUp2');
          }}
        />
      </View>
    </View>
  );
}

export default SignUp1;
