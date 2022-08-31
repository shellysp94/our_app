/* eslint-disable no-alert */
// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import {View, Pressable, Text} from 'react-native';
import NotificationItem from '../Components/NotificationItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/NotificationStyle';
import axios from 'axios';
import UpperBar from '../Components/UpperBar';
import {useSelector, useDispatch} from 'react-redux';
import {setNotificatation} from '../store/Slices/generalSlice';

const Notifications = () => {
  const userConfig = useSelector(state => state.configuration.userConfig);
  const notifications = useSelector(state => state.general.myNotification);
  const dispatch = useDispatch();

  const showNotifications = async userNum => {
    try {
      const res = await axios.get(
        `http://192.168.1.141:3000/notifications/${userConfig.user_id}`,
      );
      dispatch(setNotificatation({myNotification: res.data}));
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    showNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <UpperBar title={'Notifications'} />
      <Pressable style={styles.clearAllBtn}>
        <Ionicons name="trash-outline" size={25} color={'white'} />
        <Text style={styles.textClearBtn}>Clear All</Text>
      </Pressable>
      <View style={styles.itemsContainer}>
        {notifications.map((item, index) => {
          return <NotificationItem key={index} details={item} />;
        })}
        <NotificationItem key={1} details={{}} />
      </View>
    </View>
  );
};

export default Notifications;
