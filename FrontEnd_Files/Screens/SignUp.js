/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-alert */
/* eslint-disable no-useless-escape */
import React, {useState} from 'react';
import {View, Text, ScrollView, Button, Pressable} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Chip} from 'react-native-paper';
import Hobbies from '../Components/Filters/Hobbies';
import styles from '../Styles/SignUpStyle';
import axios from 'axios';
import TInput from '../Components/TInput';
import {useSelector, useDispatch} from 'react-redux';
import {updateDetails} from '../store/Slices/configurationSlice';

function SignUp() {
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
  const [gender, setGender] = useState('');
  const [sexualOrientation, setSexualOrientation] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState(0);
  const [pronoun, setPronoun] = useState(0);
  const [isFirstNameValid, setFirstNameValid] = useState(true);
  const [isLastNameValid, setLastNameValid] = useState(true);
  const [isEmailValid, setEmailValid] = useState(true);
  const dispatch = useDispatch();

  const baseUrl = 'http://192.168.1.103:3000/auth/register';

  const hobbies = useSelector(state => state.configuration.myHobbies);
  const rawText = useSelector(state => state.general.rawText.registration_form);

  var day = date.getDate();
  var month = date.getMonth() + 1;
  day = day.toString().padStart(2, '0');
  month = month.toString().padStart(2, '0');

  const chipStyle = (value, chip) => {
    return {margin: 2, backgroundColor: value === chip ? '#48D1CC' : '#EBEBEB'};
  };
  const chipTextColor = (value, chip) => {
    return {color: value === chip ? '#0E6070' : '#2C143E'};
  };

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
  const validateName = (name, setName) => {
    if (!/[^a-zA-Z]/.test(name)) {
      setName(true);
    } else {
      setName(false);
    }
  };
  const handleEmail = value => {
    setEmail(value);
    validateEmail();
  };

  let configuration = {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: `${day}-${month}-${year}`,
    city: city,
    gender: gender,
    phone_number: phoneNumber,
    relationship_status: relationshipStatus,
    sexual_orientation: sexualOrientation,
    profession: profession,
    pronoun: pronoun,
    hobbies: [...hobbies],
  };

  const AddUserToDB = async event => {
    try {
      const response = await axios.post(`${baseUrl}`, configuration);
      if (response.data.hasOwnProperty('msg')) {
        alert(response.data.msg);
      } else {
        let loginDetails = {
          userConfig: response.data,
          email: response.data.email,
          fullName: `${response.data.first_name} ${response.data.last_name}`,
          token: response.data.token,
        };

        dispatch(updateDetails(loginDetails));
        navigation.navigate('Log In stack');
      }
    } catch (error) {
      alert(error);
    }
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
              onChangeText={() => validateName(firstName, setFirstName)}
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
              onChangeText={() => validateName(firstName, setLastName)}
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
              onChangeText={value => handleEmail(value)}
            />
            {!isEmailValid && <Text style={styles.invalidText}>invalid</Text>}
          </View>
          <TInput
            style={styles.textInput}
            value={password}
            title={'Password'}
            secureTextEntry={true}
            onChangeText={val => setPassword(val)}
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
        <View style={styles.catagory}>
          <Text style={styles.catagoryText}>I identify as</Text>
          <View style={styles.chipBlock}>
            {rawText.gender.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(gender, item)}
                  textStyle={chipTextColor(gender, item)}
                  onPress={() => setGender(`${item}`)}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <View style={styles.catagory}>
          <Text style={styles.catagoryText}>My relationship status</Text>
          <View style={styles.chipBlock}>
            {rawText.relationship_status.slice(1).map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(relationshipStatus, item)}
                  textStyle={chipTextColor(relationshipStatus, item)}
                  onPress={() => setRelationshipStatus(`${item}`)}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <View style={styles.catagory}>
          <Text style={styles.catagoryText}>I prefer to be called</Text>
          <View style={styles.chipBlock}>
            {rawText.sexual_orientation.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(sexualOrientation, item)}
                  textStyle={chipTextColor(sexualOrientation, item)}
                  onPress={() => setSexualOrientation(`${item}`)}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <View style={styles.catagory}>
          <Text style={styles.catagoryText}>pronoun</Text>
          <View style={styles.chipBlock}>
            {rawText.pronoun.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(pronoun, item)}
                  textStyle={chipTextColor(pronoun, item)}
                  onPress={() => setPronoun(`${item}`)}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>

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

        <View style={styles.Hobbies}>
          <Text style={styles.catagoryText}>My hobbies are:</Text>
          <Hobbies
            styling={'SignUp'}
            text={
              hobbies.length !== 0 ? hobbies.toString() : 'Pick your hobbies'
            }
            data={rawText.Hobbies}
            list={hobbies}
          />
        </View>
        <View style={styles.ButtonSection1}>
          <Button
            color="#48D1CC"
            title="Continue"
            onPress={() => {
              AddUserToDB();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default SignUp;
