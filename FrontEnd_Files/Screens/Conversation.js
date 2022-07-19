/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, {useEffect, useState} from 'react';
import styles from '../Styles/ChatStyle';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MessageForm from '../Components/Chat/MessageForm';
import MyMessage from '../Components/Chat/MyMessage';
import TheirMessage from '../Components/Chat/TheirMessage';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import SocketService from '../utils/socket';

const Conversation = ({route}) => {
  const myId = useSelector(state => state.userConfig.user_id);
  const friendId = route.params.friendConfig.user_id;
  const friendName = `${route.params.friendConfig.first_name} ${route.params.friendConfig.last_name}`;
  const messagesUrl = 'http://192.168.1.141:3000/chats/';
  const messages = useSelector(state => state.currChat);
  const dispatch = useDispatch();
  const getMessages = async () => {
    //FIX ME there is a problem with update list of open chats
    try {
      const res = await axios.get(`${messagesUrl}${myId}/${friendId}/0`);
      dispatch({
        type: 'SET_CURR_CHAT',
        currChat: res.data,
      });
    } catch {
      alert('in catch');
    }
  };

  // const socket = new SocketService();
  // socket.onmessage;
  useEffect(() => {
    getMessages();
  }, []); //BUG - fix the dependencies

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={styles.chatFeed}>
            {messages.length > 0 ? (
              messages.map((item, index) => (
                <View key={index} style={styles.messageBlock}>
                  {myId === item.sender_user_id ? (
                    <MyMessage content={item.content} />
                  ) : (
                    <TheirMessage
                      friendName={friendName}
                      content={item.content}
                    />
                  )}
                </View>
              ))
            ) : (
              <Text>This is an empty chat</Text>
            )}
          </View>
          <View style={styles.messageFormContainer}>
            <MessageForm friendID={friendId} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Conversation;
