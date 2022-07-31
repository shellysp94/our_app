/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {View, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../Styles/ChatStyle';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TInput from '../TInput';
import {addMessageToChat} from '../../store/Slices/chatSlice';
const MessageForm = props => {
  const myUserId = useSelector(state => state.configuration.userConfig.user_id);
  const [message, setMessage] = useState('');
  const messages = useSelector(state => state.chat.currChat);
  const dispatch = useDispatch();
  const HandleSubmit = async () => {
    try {
      const myMessage = await axios.post(
        `http://192.168.1.103:3000/messages/${myUserId}/${props.friendID}`,
        {
          content: message,
        },
      );
      dispatch(addMessageToChat({myMessage: myMessage.data[0]}));
      setMessage('');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View
      style={{
        marginTop: 10,
        flexDirection: 'row',
      }}>
      <View style={{width: '88%'}}>
        <TInput
          style={styles.TInput.messageInput}
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
