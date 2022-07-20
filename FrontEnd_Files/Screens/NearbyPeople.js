/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, {useCallback, useEffect} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import UserItem from '../Components/userItem';
import UpperBar from '../Components/UpperBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/NearbyPeople';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {updateNearbyPeople} from '../store/Slices/peopleSlice';

const NearbyPeople = ({navigation}) => {
  const user_id = useSelector(state => state.configuration.userConfig.user_id);
  const filters = useSelector(state => state.configuration.filters);
  const nearbyPeople = useSelector(state => state.people.nearbyPeople);
  const dispatch = useDispatch();

  const showFilters = () => {
    navigation.openDrawer();
  };

  const onApplyHandler = useCallback(async () => {
    try {
      const people = await axios.post(
        `http://192.168.1.141:3000/filters/${user_id}`,
        {
          ...filters,
        },
      );

      dispatch(updateNearbyPeople({nearbyPeople: people.data}));
    } catch (error) {
      alert(error);
    }
  }, [user_id, filters, dispatch]);

  const onFriendRequest = async userNum => {
    try {
      await axios.post(
        `http://192.168.1.141:3000/friendRequest/send/${user_id}/${userNum}`,
      );
      onApplyHandler(); //FIX ME?
    } catch (error) {
      alert(error);
    }
  };

  const mappingUsers = (item, index) => {
    if (item.mutualConnections === 1) {
      return (
        <UserItem
          key={index}
          config={item}
          name={`${item.first_name} ${item.last_name}`}
          type={'friend'}
        />
      );
    } else if (item.requestsUserSent === 1) {
      return (
        <UserItem
          key={index}
          config={item}
          name={`${item.first_name} ${item.last_name}`}
          type={'requestsUserSent'}
        />
      );
    } else if (item.requestsUserRecieved === 1) {
      return (
        <UserItem
          key={index}
          config={item}
          name={`${item.first_name} ${item.last_name}`}
          type={'requestsUserRecieved'}
        />
      );
    } else if (item.notConnected === 1) {
      return (
        <UserItem
          key={index}
          config={item}
          name={`${item.first_name} ${item.last_name}`}
          type={'notFriend'}
          function={onFriendRequest}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <UpperBar title={'Nearby people'} />
      <View style={styles.openFiltersContainer}>
        <Pressable
          style={styles.filtersStyle}
          onPress={showFilters}
          onApply={onApplyHandler}>
          <Ionicons name={'filter-outline'} size={22} />
          <Text style={styles.openFiltersText}>Open Filters</Text>
        </Pressable>
      </View>

      <View>
        <ScrollView style={styles.scroll}>
          {nearbyPeople.map((item, index) => mappingUsers(item, index))}
          {Object.keys(nearbyPeople).length === 0 && <Text>No people</Text>}
        </ScrollView>
      </View>
    </View>
  );
};

export default NearbyPeople;
