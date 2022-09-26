/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import {Chip} from 'react-native-paper';
import styles from '../../Styles/SignUpStyle';
import Theme from '../../Styles/Theme';
import {useSelector, useDispatch} from 'react-redux';
import {updateConfiguration} from '../../store/Slices/configurationSlice';

//NOTICE: When the application loads, an API call is made to receive the constants of the form. The constants are saved under rawText object

function SignUp2({navigation}) {
  const rawText = useSelector(state => state.general.rawText.registration_form);
  const [gender, setGender] = useState('');
  const [sexualOrientation, setSexualOrientation] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState(0);
  const [pronoun, setPronoun] = useState(0);
  const dispatch = useDispatch();

  const chipStyle = (value, chip) => {
    return {
      borderRadius: 7,
      margin: 4,
      backgroundColor: value === chip ? Theme.secondColor : '#EBEBEB',
    };
  };
  const chipTextColor = (value, chip) => {
    return {
      fontFamily: Theme.fontFamilyRegular,
      color: value === chip ? '#FFFFFF' : '#2C143E',
    };
  };

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
      <View style={styles.catagory}>
        <Text style={styles.catagoryText}>I identify as</Text>
        <View style={styles.chipBlock}>
          {rawText.gender.map((item, index) => {
            return (
              <Chip
                key={index}
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
          {rawText.relationship_status.slice(1).map((item, index) => {
            return (
              <Chip
                key={index}
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
        <Text style={styles.catagoryText}>My sexual orientation</Text>
        <View style={styles.chipBlock}>
          {rawText.sexual_orientation.map((item, index) => {
            return (
              <Chip
                key={index}
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
          {rawText.pronoun.map((item, index) => {
            return (
              <Chip
                key={index}
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
    </View>
  );
}

export default SignUp2;
