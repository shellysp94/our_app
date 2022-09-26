/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
import React, {useEffect} from 'react';
import {View, Text, Pressable, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import UserItem from '../Components/userItem';
import {updateSendRequests} from '../store/Slices/peopleSlice';
import {getCurrentPath} from '../utils/generalFunctions';
import {Divider} from 'react-native-paper';
import styles from '../Styles/FriendsRequests';

const PendingFriendRequests = props => {
  const userId = useSelector(state => state.configuration.userConfig.user_id);
  const verifyToken = useSelector(state => state.configuration.token);
  const listOfConf = useSelector(state => state.people.sendRequests);

  const path = getCurrentPath();
  const dispatch = useDispatch();
  const getMyFriendRequest = async () => {
    try {
      const friends = await axios.get(
        `${path}/friendRequest/sendRequests/${userId}`,
        {
          headers: {
            authorization: 'bearer ' + verifyToken,
          },
        },
      );
      if (!friends.data.hasOwnProperty('msg')) {
        dispatch(updateSendRequests({sent: [...friends.data]}));
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMyFriendRequest();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        onPress={() => props.setVisible(false)}>
        <Text>X</Text>
      </Pressable>
      <Text>Pending friend request</Text>
      <ScrollView style={styles.scrollContainer}>
        {listOfConf.map((item, index) => {
          return (
            <View key={index}>
              <UserItem config={item} type={'requestsUserSent'} />
              <Divider />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PendingFriendRequests;
