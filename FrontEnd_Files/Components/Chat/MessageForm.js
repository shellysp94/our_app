/* eslint-disable react/prop-types */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {View, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import styles from '../../Styles/ChatStyle';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TInput from '../TInput';

const MessageForm = props => {
  const myUserId = useSelector(state => state.configuration.userConfig.user_id);
  const [message, setMessage] = useState('');

  const HandleSubmit = async () => {
    try {
      await axios.post(
        `http://192.168.1.141:3000/messages/${myUserId}/${props.friendID}`,
        {
          content: message,
        },
      );

      setMessage('');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View style={{width: '100%', top: 30, flexDirection: 'row'}}>
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
