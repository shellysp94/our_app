/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {View, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../../Styles/ChatStyle';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TInput from '../TInput';
import {addMessageToChat} from '../../store/Slices/chatSlice';
import {getCurrentPath} from '../../utils/generalFunctions';

const MessageForm = props => {
  const myUserId = useSelector(state => state.configuration.userConfig.user_id);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const path = getCurrentPath();
  const verifyToken = useSelector(state => state.configuration.token);

  function onlyLettersNumbersAndSpaces(thisMessage) {
    return /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(thisMessage);
  }

  const HandleSubmit = async () => {
    try {
      if (message.length !== 0 && onlyLettersNumbersAndSpaces(message)) {
        const myMessage = await axios.post(
          `${path}/messages/${myUserId}/${props.friendID}`,
          {
            content: message,
          },
          {
            headers: {
              Authorization: 'Bearer ' + verifyToken,
            },
          },
        );

        dispatch(addMessageToChat({myMessage: myMessage.data}));
      }
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.View.messageFormInnerContainer}>
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
        style={styles.Pressables.submitButton}
        onPress={() => HandleSubmit()}>
        <Ionicons name="send-outline" size={30} color={'#1B8AA0'} />
      </Pressable>
    </View>
  );
};

export default MessageForm;
