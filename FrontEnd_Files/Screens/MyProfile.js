/* eslint-disable no-alert */
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {Chip, Avatar} from 'react-native-paper';
import Hobbies from '../Components/Filters/Hobbies';
// import ImageCard from '../Components/imageCard';
import TInput from '../Components/TInput';
import styles from '../Styles/MyProfileStyle';
import {useSelector} from 'react-redux';
import axios from 'axios';
import UpperBar from '../Components/UpperBar';

//FIX ME ליצור אובייקט שישמש כסטייט זמני וכשלוחצים על כפתור הוא יחליף את הקונפיגורציה בסטייט ובשרת

const MyProfile = () => {
  const [edit, setEdit] = useState(false);
  const [photos, setPhotos] = useState([]);
  const email = useSelector(state => state.email);
  const userConfig = useSelector(state => state.userConfig);
  // const hobbies = userConfig.hobbies;
  const url = 'http://192.168.1.141:3000/userPictures/';
  const rawText = useSelector(state => state.rawText.registration_form);
  const myhobbies = useSelector(state => state.myHobbies);

  const getPhotos = async () => {
    try {
      const res = await axios.get(`${url}${userConfig.user_id}`);
      setPhotos(res.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chipStyle = (value, chip) => {
    return {
      margin: 2,
      backgroundColor: value === chip ? '#0E6070' : '#EBEBEB',
    };
  };
  const chipTextColor = (value, chip) => {
    return {
      color: value === chip ? '#FFFFFF' : '#0E6070',
    };
  };
  return (
    <SafeAreaView style={styles.container}>
      <UpperBar title={'My Profile'} />
      <ScrollView>
        <View style={styles.photosContainer}>
          {photos.map(item => {
            return (
              <View key={photos.fileName}>
                <Pressable>
                  <Avatar.Image
                    size={80}
                    style={styles.myPic}
                    source={{uri: `data:image/gif;base64,${item.image}`}}
                  />
                </Pressable>
              </View>
            );
          })}

          <Pressable
            style={styles.touchablePen}
            onPress={() => {
              setEdit(!edit);
            }}>
            <Image
              style={styles.penPic}
              source={require('../Images/pencil.png')}
            />
          </Pressable>
        </View>
        <View style={styles.emailPassword}>
          <View style={styles.column}>
            <TInput
              style={styles.textInput}
              value={email}
              title={'Email'}
              editable={edit}
            />
          </View>
        </View>
        <View style={styles.fullName}>
          <View style={styles.column}>
            <TInput
              style={styles.nameInput}
              value={userConfig.first_name}
              title={'First Name'}
              editable={edit}
            />
          </View>
          <View style={styles.column}>
            <TInput
              style={styles.nameInput}
              value={userConfig.last_name}
              title={'Last Name'}
              editable={edit}
            />
          </View>
        </View>
        <TInput
          style={styles.textInput}
          title={`Phone number`}
          value={userConfig.phone_number}
          editable={edit}
        />
        <TInput
          style={styles.textInput}
          title={`City`}
          value={userConfig.city}
          editable={edit}
        />
        <TInput
          style={styles.textInput}
          title={`Proffesion`}
          value={userConfig.profession}
          editable={edit}
        />
        <View>
          <Text style={styles.catagoryText}>I identify as</Text>
          <View style={styles.chipsBlocks}>
            {rawText.gender.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(userConfig.gender, item)}
                  textStyle={chipTextColor(userConfig.gender, item)}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={styles.catagoryText}>I prefer to be called</Text>
          <View style={styles.chipsBlocks}>
            {rawText.sexual_orientation.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(userConfig.sexual_orientation, item)}
                  textStyle={chipTextColor(
                    userConfig.sexual_orientation,
                    item,
                  )}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={styles.catagoryText}>pronoun</Text>
          <View style={styles.chipsBlocks}>
            {rawText.pronoun.map(item => {
              return (
                <Chip
                  key={item}
                  style={chipStyle(userConfig.pronoun, item)}
                  textStyle={chipTextColor(userConfig.pronoun, item)}>
                  {item}
                </Chip>
              );
            })}
          </View>
        </View>
        <Text style={styles.catagoryText}>My relationship status</Text>
        <View style={styles.chipsBlocks}>
          {rawText.relationship_status.map(item => {
            return (
              <Chip
                key={item}
                style={chipStyle(userConfig.relationship_status, item)}
                textStyle={chipTextColor(userConfig.relationship_status, item)}>
                {item}
              </Chip>
            );
          })}
        </View>
        <View style={styles.birthday}>
          <Text>birthday🎈🎉✨</Text>
          <DatePicker
            style={styles.datePicker}
            date={userConfig.date_of_birth}
            mode={'date'}
            placeholder="enter your birthday🎈🎉✨"
            format="DD-MM-YYYY"
            maxDate={userConfig.date_of_birth}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: styles.dateIcon,
              dateInput: styles.dateInput,
            }}
            // onDateChange={date => {
            //   setBirthday(date);
            // }}
          />
        </View>
        <View style={styles.hobbies}>
          <Text style={styles.hobbiesText}>My hobbies are:</Text>
          <Hobbies
            style={styles.Pressables}
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
