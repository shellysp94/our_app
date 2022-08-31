/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
// import UplaodImageModal from '../Components/uploadImageModal';
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styles from '../Styles/newHomeStyle';
import axios from 'axios';
import UpperBar from '../Components/UpperBar';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import Theme from '../Styles/Theme';
import {updateFilters} from '../store/Slices/configurationSlice';
import {updateUsersBySearchModes} from '../store/Slices/peopleSlice';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const myLongitude = useSelector(state => state.general.myLongitude);
  const myLatitude = useSelector(state => state.general.myLatitude);
  const text = useSelector(state => state.general.rawText);
  const data = text.filters.Search_Mode;
  const myUserId = useSelector(state => state.configuration.userConfig.user_id);
  const users = useSelector(state => state.people.usersBySearchModes);
  const HobText = text['Search Mode Sentences'];

  let initialFilter = {
    search_mode_filter: '',
    hobbies_filter: 'Hobbies',
    gender_filter: 'Gender',
    relationship_filter: 'Relationship',
    interested_in_filter: 'Interested in',
    age_filter: [],
    radius_filter: 1000,
    friends_only_filter: 0,
  };

  const getUsersBySearchModes = async () => {
    try {
      const usersBySearchModes = await axios.get(
        `http://192.168.1.141:3000/dataFromSetsToClient/experience/${myUserId}`,
      );
      dispatch(
        updateUsersBySearchModes({usersBySearchModes: usersBySearchModes.data}),
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsersBySearchModes();
  }, [myLongitude, myLatitude]);

  const getImages = item => {
    if (item === 'Chill') return require(`../assets/Images/Hangout.jpg`);
    if (item === 'Study') return require(`../assets/Images/Study.jpeg`);
    if (item === 'Jam') return require(`../assets/Images/Music.jpeg`);
    if (item === 'Grab A Bite') return require(`../assets/Images/Food.jpg`);
    if (item === 'Hike') return require(`../assets/Images/Hike.jpg`);
    if (item === 'Party') return require(`../assets/Images/Party.jpg`);
    if (item === 'Gaming') return require(`../assets/Images/Gaming.jpeg`);
    if (item === 'Workout') return require(`../assets/Images/Workout.jpg`);
    if (item === 'Shuffle') return require(`../assets/Images/Shuffle.png`);
    if (item === 'Surprise') return require(`../assets/Images/Surprise.jpg`);
    if (item === 'Whatever') return require(`../assets/Images/Whatever.jpg`);
  };
  const getText = item => {
    return (
      <View style={styles.View.hobTextContainer}>
        <Text adjustsFontSizeToFit style={styles.Text.hobText}>
          {HobText[item]}
        </Text>
      </View>
    );
  };

  const surpriseMeIndex = max => {
    let index = Math.floor(Math.random() * max);
    while (data[index] === 'Surprise') {
      index = Math.floor(Math.random() * max);
    }
    return index; //FIX ME
  };
  const getFunction = async item => {
    if (item !== 'Surprise') {
      initialFilter = {...initialFilter, search_mode_filter: item};
    } else {
      const mode = data[surpriseMeIndex(data.length)]; //FIX ME - check whatever not choose
      initialFilter = {
        ...initialFilter,
        search_mode_filter: mode,
      };
      alert(`your mode is ${mode}`);
    }
    dispatch(updateFilters({filters: initialFilter}));
    navigation.navigate('Nearby People');
  };

  return (
    <View style={styles.View.container}>
      <View style={{height: 50, position: 'absolute'}}>
        <UpperBar title={'new Home'} />
      </View>
      <SwiperFlatList
        showPagination
        vertical={true}
        index={0}
        PaginationComponent={() => (
          <View style={styles.View.upArrowContainer}>
            <Ionicons color={'#FFFFFF'} size={25} name={'arrow-up-outline'} />
          </View>
        )}>
        <View style={styles.View.innterContainer}>
          {data.map((item, index) => (
            <View style={{backgroundColor: Theme.backgroundColor}} key={index}>
              <Image style={styles.child} source={getImages(item)} />

              <View style={styles.View.getTextContainer}>
                {getText(item)}
                {item !== 'Surprise' ? (
                  <View style={styles.View.bottomContainer}>
                    <Ionicons
                      color={'#FFFFFF'}
                      size={20}
                      name={'people-outline'}
                    />
                    <Text style={styles.Text.peopleInTheArea}>
                      {' '}
                      {item === 'Grab A Bite'
                        ? users.Grab_A_Bite?.length
                        : users[item]?.length}{' '}
                      online people in the area
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
                <Pressable
                  onPress={() => getFunction(item)}
                  style={styles.Pressable.checkItOut}
                  color={'blue'}>
                  <Text adjustsFontSizeToFit style={{color: '#FFFFFF'}}>
                    Check it out
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </SwiperFlatList>
    </View>
  );
};

export default Home;
