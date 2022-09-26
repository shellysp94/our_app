/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import ChatItem from '../Components/Chat/ChatItem';
import styles from '../Styles/ChatStyle';
import UpperBar from '../Components/UpperBar';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {openChats} from '../store/Slices/chatSlice';
import {getCurrentPath} from '../utils/generalFunctions';

const Chat = () => {
  const path = getCurrentPath();
  const myUserId = useSelector(state => state.configuration.userConfig.user_id);
  const verifyToken = useSelector(state => state.configuration.token);
  const chats = useSelector(state => state.chat.OpenChats);
  const dispatch = useDispatch();
  const messageWaiting = useSelector(state => state.chat.messageWaiting);

  const getAllChats = async () => {
    try {
      const res = await axios.get(`${path}/chats/${myUserId}`, {
        headers: {
          Authorization: 'Bearer ' + verifyToken,
        },
      });
      dispatch(openChats({OpenChats: res.data}));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllChats();
  }, [dispatch, messageWaiting]);

  //NOTICE: ChatItem is a component we created. TInput's code is located in the Components\Chat folder in file ChatItem.js file

  return (
    <View style={styles.View.manageChatsContainer}>
      <View style={styles.View.UpperBarContainer}>
        <UpperBar />
      </View>
      <View style={styles.View.titleContainer}>
        <Text style={styles.Text.title}>my Chats</Text>
      </View>
      <ScrollView>
        {chats?.map((item, index) => (
          <ChatItem key={index} data={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Chat;
