/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, {useEffect} from 'react';
import styles from '../Styles/ChatStyle';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';

import MessageForm from '../Components/Chat/MessageForm';
import MyMessage from '../Components/Chat/MyMessage';
import TheirMessage from '../Components/Chat/TheirMessage';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import SocketService from '../utils/socket';
import {setCurrentChat} from '../store/Slices/chatSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {useNavigation} from '@react-navigation/native';
const Conversation = ({route}) => {
  const navigation = useNavigation();
  const friendId = route.params.friendConfig.user_id;
  const friendImage = route.params.friendConfig.image;
  const friendName = `${route.params.friendConfig.first_name} ${route.params.friendConfig.last_name}`;
  const myId = useSelector(state => state.configuration.userConfig.user_id);
  const messages = useSelector(state => state.chat.currChat);
  const dispatch = useDispatch();

  const getMessages = async () => {
    //FIX ME there is a problem with update list of open chats
    try {
      const res = await axios.get(
        `http://192.168.1.141:3000/chats/${myId}/${friendId}/0`,
      );
      dispatch(
        setCurrentChat({
          currChat: res.data,
        }),
      );
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
    <KeyboardAvoidingView style={styles.container}>
      <View
        style={{
          top: 10,
          left: 10,
          padding: 7,
          flexDirection: 'row',
          width: '95%',
        }}>
        <View
          style={{
            alignSelf: 'center',
            marginRight: 10,
          }}>
          <Pressable
            style={{alignSelf: 'center'}}
            onPress={() => navigation.goBack()}>
            <Ionicons name={'arrow-back-outline'} size={30} />
          </Pressable>
        </View>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Image
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
            source={{uri: `data:image/gif;base64,${friendImage}`}}
          />
          <Text style={{...styles.title, left: 30, alignSelf: 'center'}}>
            {friendName}
          </Text>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.chatFeed}>
          <View style={{height: '88%'}}>
            <ScrollView>
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
            </ScrollView>
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
