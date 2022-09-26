/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import React, {useEffect} from 'react';
import {View, ScrollView, Text} from 'react-native';
import NotificationItem from '../Components/NotificationItem';
import styles from '../Styles/NotificationStyle';
import axios from 'axios';
import UpperBar from '../Components/UpperBar';
import {useSelector, useDispatch} from 'react-redux';
import {setNotificatation} from '../store/Slices/generalSlice';
import {getCurrentPath} from '../utils/generalFunctions';

const Notifications = () => {
  const userConfig = useSelector(state => state.configuration.userConfig);
  const notifications = useSelector(state => state.general.myNotification);
  const dispatch = useDispatch();
  const path = getCurrentPath();
  const verifyToken = useSelector(state => state.configuration.token);
  const showNotifications = async () => {
    try {
      const res = await axios.get(
        `${path}/notifications/${userConfig.user_id}`,
        {
          headers: {
            Authorization: 'Bearer ' + verifyToken,
          },
        },
      );
      dispatch(setNotificatation({myNotification: res.data}));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    showNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <UpperBar />
      {notifications.length === 0 ? (
        <View style={{height: '60%', justifyContent: 'center'}}>
          <Text style={{alignSelf: 'center'}}>
            there are no notifications to display
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.itemsContainer}>
          {notifications.map((item, index) => {
            return <NotificationItem key={index} details={item} />;
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default Notifications;
