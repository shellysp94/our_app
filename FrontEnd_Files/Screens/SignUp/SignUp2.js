/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {View, Text, ScrollView, Button} from 'react-native';
import {Chip} from 'react-native-paper';
import styles from '../../Styles/SignUpStyle';
import Theme from '../../Styles/Theme';
import {useSelector, useDispatch} from 'react-redux';
import {updateConfiguration} from '../../store/Slices/configurationSlice';

function SignUp2({navigation}) {
  const rawText = useSelector(state => state.general.rawText.registration_form);

  const [gender, setGender] = useState('');
  const [sexualOrientation, setSexualOrientation] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState(0);
  const [pronoun, setPronoun] = useState(0);
  const dispatch = useDispatch();
  const signUpConfig = useSelector(state => state.configuration.signUpConfig);
  console.log('-------SignUp2-------');
  console.log(signUpConfig);

  const chipStyle = (value, chip) => {
    return {
      borderRadius: 10,
      margin: 2,
      backgroundColor: value === chip ? '#48D1CC' : '#EBEBEB',
    };
  };
  const chipTextColor = (value, chip) => {
    return {
      fontFamily: Theme.fontFamilyRegular,
      color: value === chip ? '#0E6070' : '#2C143E',
    };
  };
  console.log('gender: ', gender);
  let configuration = {
    relationship_status: relationshipStatus,
    sexual_orientation: sexualOrientation,
    gender: gender,
    pronoun: pronoun,
  };
  const updateState = () => {
    dispatch(updateConfiguration({signUpConfig: {...configuration}}));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up 🥳</Text>
      <ScrollView style={styles.scroll}>
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

        <View style={styles.ButtonSection1}>
          <Button
            color="#48D1CC"
            title="Continue"
            onPress={() => {
              updateState();
              navigation.navigate('SignUp3');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default SignUp2;
