/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, ScrollView, Pressable} from 'react-native';
import UserItem from '../Components/userItem';
import UpperBar from '../Components/UpperBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/NearbyPeopleStyle';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {updateNearbyPeople} from '../store/Slices/peopleSlice';
import StatusModal from '../Components/StatusModal';
import {getCurrentPath} from '../utils/generalFunctions';
import {applyPressed} from '../store/Slices/peopleSlice';

const NearbyPeople = ({navigation}) => {
  const path = getCurrentPath();
  const hideModal = () => setVisible(false);
  const [visible, setVisible] = useState(true);
  const userConfig = useSelector(state => state.configuration.userConfig);
  const user_id = userConfig.user_id;
  const filters = useSelector(state => state.configuration.filters);
  const nearbyPeople = useSelector(state => state.people.nearbyPeople);
  const refresh = useSelector(state => state.general.refresh);
  const isApplyPressed = useSelector(state => state.people.applyPressed);
  const dispatch = useDispatch();
  const showFilters = () => {
    navigation.openDrawer();
  };
  const verifyToken = useSelector(state => state.configuration.token);
  const onApplyHandler = useCallback(async () => {
    try {
      console.log('Filters: ', JSON.stringify(filters, null, 2));
      const people = await axios.post(
        `${path}/filters/${user_id}/${
          filters.online_filter === true ? '1' : '0'
        }`,
        filters,
        {
          headers: {
            Authorization: 'Bearer ' + verifyToken,
          },
        },
      );
      dispatch(updateNearbyPeople({nearbyPeople: people.data}));
      dispatch(applyPressed({pressed: false}));
    } catch (err) {
      console.error(err);
      console.log(err);
    }
  }, [isApplyPressed]);

  useEffect(() => {
    onApplyHandler();
  }, [user_id, filters, refresh]);

  useEffect(() => {
    setVisible(true);
  }, [isApplyPressed]);

  const onFriendRequest = async userNum => {
    try {
      await axios.post(
        `${path}/friendRequest/send/${user_id}/${userNum}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + verifyToken,
          },
        },
      );
      onApplyHandler(); //FIX ME?
    } catch (error) {
      console.error(error);
    }
  };
  const onAccept = async userNum => {
    try {
      await axios.post(
        `${path}/friendRequest/approve/${user_id}/${userNum}`,
        {},
        {
          headers: {
            authorization: 'bearer ' + verifyToken,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const mappingUsers = nearbyPeople.map((item, index) => {
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
    } else if (item.requestsUserReceived === 1) {
      return (
        <UserItem
          key={index}
          config={item}
          name={`${item.first_name} ${item.last_name}`}
          type={'requestsUserRecieved'}
          function={onAccept}
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
  });

  return (
    <View style={styles.View.container}>
      <UpperBar title={'Nearby people'} />
      <View style={styles.View.openFiltersContainer}>
        <StatusModal
          visible={visible}
          setVisible={setVisible}
          closeModal={hideModal}
        />
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
          {mappingUsers}
          {Object.keys(nearbyPeople).length === 0 && (
            <Text style={{color: 'white'}}>No people</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default NearbyPeople;
