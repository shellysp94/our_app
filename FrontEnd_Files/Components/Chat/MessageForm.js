/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {View, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import styles from '../../Styles/ChatStyle';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TInput from '../TInput';

const MessageForm = () => {
  const myUserId = useSelector(state => state.userConfig.user_id);
  const [message, setMessage] = useState('');

  const newMessage = `http://192.168.1.141:3000/messages/${myUserId}`;

  const HandleSubmit = async () => {
    try {
      await axios.post(`${newMessage}/2`, {
        content: message,
      });

      setMessage('');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={{width: '100%', flexDirection: 'row'}}>
      <View style={{width: '88%'}}>
        <TInput
          style={styles.messageInput}
          title={'Send a message ...'}
          value={message}
          secureTextEntry={false}
          onChangeText={value => setMessage(value)}
        />
      </View>

      <Pressable
        style={{position: 'relative', margin: 8}}
        onPress={HandleSubmit}>
        <Ionicons name="send-outline" size={30} color={'#1B8AA0'} />
      </Pressable>
    </View>
  );
};

export default MessageForm;
