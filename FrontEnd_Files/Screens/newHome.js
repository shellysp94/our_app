/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {useEffect, useCallback} from 'react';
import {View, Text, ImageBackground, Pressable, Dimensions} from 'react-native';
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
import {getCurrentPath} from '../utils/generalFunctions';

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const path = getCurrentPath();

  const status = useSelector(state => state.general?.status);
  const myLongitude = useSelector(state => state.general?.myLongitude);
  const myLatitude = useSelector(state => state.general?.myLatitude);

  const refresh = useSelector(state => state.general?.refresh);
  const text = useSelector(state => state.general?.rawText);
  const data = useSelector(state => state.general.rawText.filters?.Search_Mode);
  const myUserId = useSelector(
    state => state.configuration.userConfig?.user_id,
  );
  const verifyToken = useSelector(state => state.configuration?.token);
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
    friends_only_filter: false,
    online_filter: true,
  };

  const getUsersBySearchModes = useCallback(async () => {
    try {
      const usersBySearchModes = await axios.get(
        `${path}/dataFromSetsToClient/experience/${myUserId}`,
        {
          headers: {
            Authorization: 'Bearer ' + verifyToken,
          },
        },
      );
      dispatch(
        updateUsersBySearchModes({usersBySearchModes: usersBySearchModes.data}),
      );
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    if (status === 'connected') getUsersBySearchModes();
  }, [myLongitude, myLatitude, refresh]);

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
    while (data[index] === 'Surprise' || data[index] === 'Whatever') {
      index = Math.floor(Math.random() * max);
    }
    return index;
  };
  const getFunction = async item => {
    if (item !== 'Surprise') {
      initialFilter = {...initialFilter, search_mode_filter: item};
    } else {
      const mode = data[surpriseMeIndex(data.length)];
      initialFilter = {
        ...initialFilter,
        search_mode_filter: mode,
      };
      console.error(`your mode is ${mode}`);
    }
    dispatch(updateFilters({filters: initialFilter}));
    navigation.navigate('Nearby People');
  };

  return (
    <View style={styles.View.container}>
      <View style={{height: 50, position: 'absolute'}}>
        <UpperBar />
      </View>
      <SwiperFlatList
        showPagination
        PaginationComponent={() => (
          <View style={styles.View.upArrowContainer}>
            <Ionicons
              color={'#FFFFFF'}
              size={25}
              name={'arrow-forward-outline'}
            />
          </View>
        )}
        data={data}
        renderItem={({item}) => (
          <ImageBackground
            resizeMode="cover"
            style={styles.child}
            source={getImages(item)}>
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
                    {users[item]?.length} online people in the area
                  </Text>
                </View>
              ) : (
                <View />
              )}
              <Pressable
                onPress={() => getFunction(item)}
                style={styles.Pressable.checkItOut}
                color={'blue'}>
                <Text
                  adjustsFontSizeToFit
                  style={{
                    color: '#FFFFFF',
                    fontFamily: Theme.fontFamilyRegular,
                  }}>
                  Check it out
                </Text>
              </Pressable>
            </View>
          </ImageBackground>
        )}
      />
    </View>
  );
};

export default Home;
