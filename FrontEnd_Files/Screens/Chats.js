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
import {openChats} from '../store/Slices/chatSlice';
const Chat = () => {
  const myUserId = useSelector(state => state.configuration.userConfig.user_id);
  const chats = useSelector(state => state.chat.OpenChats);
  const dispatch = useDispatch();

  const getAllChats = async () => {
    //FIX ME there is a problem with update list of open chats
    try {
      const res = await axios.get(
        `http://192.168.1.141:3000/chats/${myUserId}`,
      );
      dispatch(openChats({OpenChats: res.data}));
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <View style={styles.manageChatsContainer}>
      <UpperBar title={'Chats'} />
      <View>
        {chats &&
          chats.map((item, index) => <ChatItem key={index} data={item} />)}
      </View>
    </View>
  );
};

export default Chat;
