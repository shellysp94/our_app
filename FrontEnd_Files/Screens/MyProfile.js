/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import {Chip} from 'react-native-paper';
import Hobbies from '../Components/Filters/Hobbies';
import TInput from '../Components/TInput';
import styles from '../Styles/MyProfileStyle';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import UpperBar from '../Components/UpperBar';
import Theme from '../Styles/Theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getCurrentPath} from '../utils/generalFunctions';
import {setAllMyPictures} from '../store/Slices/picturesSlice';

const MyProfile = props => {
  const path = getCurrentPath();
  const [edit, setEdit] = useState(false);
  const photos = useSelector(state => state.pictures.myPictures);
  const userConfig = useSelector(state => state.configuration.userConfig);
  const email = useSelector(state => state.configuration.email);
  let tempConfig = userConfig;
  const rawText = useSelector(
    state => state.general.rawText?.registration_form,
  );
  const myProfilePicture = useSelector(
    state => state.pictures.myPictures[0]?.image,
  );
  const myhobbies = useSelector(state => state.configuration.myHobbies);
  let birthday = userConfig.date_of_birth;
  const dispatch = useDispatch();
  birthday = birthday.split('-');
  const mode = 'date';
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  var year = birthday[0];
  var month = birthday[1];
  var day = parseInt(birthday[2].slice(0, 2));
  year = year.toString();
  const [date, setDate] = useState(new Date(year, month, day));
  const getPhotos = async () => {
    try {
      const res = await axios.get(`${path}/userPictures/${userConfig.user_id}`);
      dispatch(setAllMyPictures({myPictures: [...res.data]}));
    } catch (error) {
      console.error(error);
    }
  };
  const onChangeDate = (event, selectedDate) => {
    setShow(false);
    setDate(selectedDate);
  };
  useEffect(() => {
    getPhotos();
  }, []);

  const chipStyle = (value, chip) => {
    return {
      margin: 2,
      backgroundColor: value === chip ? Theme.highLightColor : '#EBEBEB',
    };
  };
  const chipTextColor = (value, chip) => {
    return {
      color: value === chip ? Theme.secondColor : '#2C143E',
      fontFamily: Theme.fontFamilyRegular,
    };
  };
  return (
    <SafeAreaView style={styles.SafeAreaView.container}>
      <UpperBar />
      <ScrollView>
        <View style={styles.View.photosContainer}>
          <ScrollView style={{flex: 1, marginLeft: 30}} horizontal={true}>
            {photos?.map((item, index) => {
              return (
                <View style={{margin: 3}} key={index}>
                  <Pressable>
                    <Image
                      style={styles.Image.myPic}
                      source={{uri: `data:image/gif;base64,${item?.image}`}}
                    />
                  </Pressable>
                </View>
              );
            })}
            {photos === [] && (
              <Image
                style={styles.Image.myPic}
                source={{
                  uri: `data:image/gif;base64,${
                    myProfilePicture !== undefined
                      ? myProfilePicture
                      : userConfig.image
                  }`,
                }}
              />
            )}
          </ScrollView>
          <View style={{marginRight: 30}}>
            <Pressable
              style={styles.Pressable.uploadPhotos}
              onPress={() =>
                navigation.navigate('UploadPictures', {
                  page: 'my Profile',
                })
              }>
              <Text style={{color: '#FFFFFF'}}>upload photos</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.View.emailPassword}>
          <TextInput
            style={styles.TextInput.emailInput}
            value={email}
            editable={false}
            placeholder={'Email'}
            outlineColor={'#13869D'}
            underlineColor="#13869D"
            dense={true}
            onChangeText={val => props.onChangeText(val)}
          />
        </View>
        <View style={styles.View.fullName}>
          <View style={styles.View.column}>
            <TInput
              style={styles.TInput.nameInput}
              value={tempConfig.first_name}
              title={'First Name'}
              editable={edit}
            />
          </View>
          <View style={styles.View.column}>
            <TInput
              style={styles.TInput.nameInput}
              value={tempConfig.last_name}
              title={'Last Name'}
              editable={edit}
            />
          </View>
        </View>
        <TInput
          style={styles.TInput.textInput}
          title={`Phone number`}
          value={tempConfig.phone_number}
          editable={edit}
        />
        <TInput
          style={styles.TInput.textInput}
          title={`City`}
          value={tempConfig.city}
          editable={edit}
        />
        <TInput
          style={styles.TInput.textInput}
          title={`Profession`}
          value={userConfig.profession}
          editable={edit}
        />
        <View>
          <Text style={styles.Text.catagoryText}>I identify as</Text>
          <View style={styles.View.chipsBlocks}>
            {rawText.gender.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(tempConfig.gender, item)}
                  textStyle={chipTextColor(tempConfig.gender, item)}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={styles.Text.catagoryText}>My sexual orientation</Text>
          <View style={styles.View.chipsBlocks}>
            {rawText.sexual_orientation.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(tempConfig.sexual_orientation, item)}
                  textStyle={chipTextColor(
                    tempConfig.sexual_orientation,
                    item,
                  )}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={styles.Text.catagoryText}>pronoun</Text>
          <View style={styles.View.chipsBlocks}>
            {rawText.pronoun.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(tempConfig.pronoun, item)}
                  textStyle={chipTextColor(tempConfig.pronoun, item)}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <Text style={styles.Text.catagoryText}>My relationship status</Text>
        <View style={styles.View.chipsBlocks}>
          {rawText.relationship_status.map(item => {
            return (
              <Chip
                key={item}
                style={chipStyle(tempConfig.relationship_status, item)}
                textStyle={chipTextColor(tempConfig.relationship_status, item)}>
                {item}
              </Chip>
            );
          })}
        </View>
        <View style={styles.View.birthday}>
          <Text style={styles.Text.catagoryText}>birthday🎈🎉✨</Text>
          <Pressable
            style={styles.View.viewStyle}
            onPress={() => setShow(!show)}>
            <Text style={styles.Text.dateText}>
              {day}-{month}-{year}
            </Text>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                disabled={true}
                mode={mode}
                is24Hour={true}
                onChange={onChangeDate}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.View.hobbies}>
          <Text style={styles.Text.hobbiesText}>My hobbies are:</Text>
          <Hobbies
            styling={'SignUp'}
            style={styles.Pressable.Pressables}
            text={
              myhobbies.length !== 0
                ? myhobbies.toString()
                : 'Pick your hobbies'
            }
            data={rawText.Hobbies}
            list={myhobbies}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfile;
