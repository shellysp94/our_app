/* eslint-disable no-alert */
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import styles from '../Styles/ChatStyle';
import {View} from 'react-native';
import MessageForm from '../Components/Chat/MessageForm';
import MyMessage from '../Components/Chat/MyMessage';
import TheirMessage from '../Components/Chat/TheirMessage';
import {useSelector} from 'react-redux';
import axios from 'axios';

const Conversation = () => {
  const messagesUrl = 'http://192.168.1.141:3000/messages/';
  const userId = useSelector(state => state.userConfig.user_id);
  const [messages, setMessages] = useState([]);
  const getMessages = async () => {
    //FIX ME there is a problem with update list of open chats
    try {
      const res = await axios.get(`${messagesUrl}${userId}/0`);
      setMessages(res.data);
    } catch {
      alert('in catch');
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  console.log(messages);
  return (
    <View>
      <View style={styles.chatFeed}>
        {messages.map((item, index) => (
          <View key={index} style={styles.messageBlock}>
            <TheirMessage content={item.content} />
          </View>
        ))}
      </View>
      <View style={styles.messageFormContainer}>
        <MessageForm lst={messages} />
      </View>
    </View>
  );
};

export default Conversation;
