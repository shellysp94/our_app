/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, {useCallback, useEffect} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import UserItem from '../Components/userItem';
import UpperBar from '../Components/UpperBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/NearbyPeopleStyle';
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
    //BUG not render on filters change. render sometimes onSave code
    try {
      const people = await axios.post(
        `http://192.168.1.141:3000/filters/${user_id}`, //NOTICE: use this url or another?
        filters,
      );
      dispatch(updateNearbyPeople({nearbyPeople: people.data}));
    } catch (error) {
      alert(error);
    }
  }, [user_id, filters, dispatch]);

  useEffect(() => {
    onApplyHandler();
  }, []);

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
    <View style={styles.View.container}>
      <UpperBar title={'Nearby people'} />
      <View style={styles.View.openFiltersContainer}>
        <Pressable
          style={styles.Pressable.filtersStyle}
          onPress={showFilters}
          onApply={onApplyHandler}>
          <Ionicons name={'filter-outline'} size={22} />
          <Text style={styles.Text.openFiltersText}>Open Filters</Text>
        </Pressable>
      </View>

      <View>
        <ScrollView style={styles.ScrollView.scroll}>
          {nearbyPeople.map((item, index) => mappingUsers(item, index))}
          {Object.keys(nearbyPeople).length === 0 && <Text>No people</Text>}
        </ScrollView>
      </View>
    </View>
  );
};

export default NearbyPeople;