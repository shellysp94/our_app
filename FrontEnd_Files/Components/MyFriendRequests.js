/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import UserItem from '../Components/userItem';
import {getCurrentPath} from '../utils/generalFunctions';
import {refreshOnlineUsers} from '../store/Slices/generalSlice';
import {updateReceivedRequests} from '../store/Slices/peopleSlice';
import styles from '../Styles/FriendsRequests';

const MyFriendRequests = props => {
  const listOfConf = useSelector(state => state.people.receivedRequests);
  const userConfig = useSelector(state => state.configuration.userConfig);
  const verifyToken = useSelector(state => state.configuration.token);

  const user_id = userConfig.user_id;
  const path = getCurrentPath();
  const dispatch = useDispatch();
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
      dispatch(refreshOnlineUsers());
    } catch (error) {
      console.error(error);
    }
  };

  const getMyFriendRequest = async () => {
    try {
      const friends = await axios.get(
        `${path}/friendRequest/receivedRequests/${user_id}`,
        {
          headers: {
            authorization: 'bearer ' + verifyToken,
          },
        },
      );
      if (!friends.data.hasOwnProperty('msg')) {
        dispatch(updateReceivedRequests({requests: [...friends.data]}));
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
      <Text>My friend requests</Text>
      {listOfConf &&
        listOfConf.map(item => {
          return (
            <UserItem
              config={item}
              key={`${item.user_id}`}
              type={'requestsUserReceived'}
              function={onAccept}
            />
          );
        })}
    </View>
  );
};

export default MyFriendRequests;
