/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import React, {useCallback, useEffect} from 'react';
import {View} from 'react-native';
import ChatItem from '../Components/Chat/ChatItem';
import styles from '../Styles/ChatStyle';
import UpperBar from '../Components/UpperBar';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';

const Chat = () => {
  const allChats = 'http://192.168.1.141:3000/chats';
  const myUserId = useSelector(state => state.userConfig.user_id);

  const dispatch = useDispatch();
  const openChats = useSelector(state => state.OpenChats);
  //FIX ME - need useCallback????
  const getAllChats = useCallback(async () => {
    //FIX ME there is a problem with update list of open chats
    try {
      const res = await axios.get(`${allChats}/${myUserId}`);
      dispatch({
        type: 'ALL_CHATS',
        OpenChats: res.data,
      });
    } catch (error) {
      alert(error);
    }
  }, [dispatch]);

  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <View style={styles.manageChatsContainer}>
      <UpperBar title={'Chats'} />
      <View>
        {openChats &&
          openChats.map((item, index) => <ChatItem key={index} data={item} />)}
      </View>
    </View>
  );
};

export default Chat;
