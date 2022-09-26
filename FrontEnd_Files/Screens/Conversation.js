/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef} from 'react';
import styles from '../Styles/ChatStyle';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Image,
} from 'react-native';
import {getCurrentPath} from '../utils/generalFunctions';
import MessageForm from '../Components/Chat/MessageForm';
import MyMessage from '../Components/Chat/MyMessage';
import TheirMessage from '../Components/Chat/TheirMessage';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentChat, newMessageWaiting} from '../store/Slices/chatSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const Conversation = ({route}) => {
  const path = getCurrentPath();
  const navigation = useNavigation();
  const friendId = route.params.friendConfig.user_id;
  const friendImage = route.params.friendConfig.image;
  const friendName = `${route.params.friendConfig.first_name} ${route.params.friendConfig.last_name}`;
  const myId = useSelector(state => state.configuration.userConfig.user_id);
  const messages = useSelector(state => state.chat.currChat);

  const verifyToken = useSelector(state => state.configuration.token);
  const messageWaiting = useSelector(state => state.chat.messageWaiting);

  const scrollViewRef = useRef();

  const dispatch = useDispatch();
  const getMessages = async () => {
    try {
      const res = await axios.get(`${path}/chats/${myId}/${friendId}/0`, {
        headers: {
          Authorization: 'Bearer ' + verifyToken,
        },
      });
      if (res.data.hasOwnProperty('msg')) {
        dispatch(
          setCurrentChat({
            currChat: [],
          }),
        );
      } else {
        dispatch(
          setCurrentChat({
            currChat: res.data,
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [dispatch, messageWaiting]);

  //NOTICE: MessageForm,myMessage and TheirMessage are components we created. Each of the codes is located in the Components\Chat folder in the file as the component name

  return (
    <KeyboardAvoidingView style={styles.View.container}>
      <View style={styles.View.chatDetailsContainer}>
        <Pressable
          style={styles.Pressables.arrowBack}
          onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back-outline'} size={30} />
        </Pressable>
        <View style={styles.View.friendImage}>
          <Image
            style={styles.Image.userPic}
            source={{uri: `data:image/gif;base64,${friendImage}`}}
          />
          <Text style={{...styles.Text.title, left: 30, alignSelf: 'center'}}>
            {friendName}
          </Text>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.View.chatFeed}>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({animated: true})
            }
            style={{height: '80%'}}>
            {messages.length > 0 ? (
              messages.map((item, index) =>
                myId === item.sender_user_id ? (
                  <View key={index}>
                    <MyMessage
                      content={item.content}
                      time={item.creation_date}
                    />
                  </View>
                ) : (
                  <View key={index}>
                    <TheirMessage
                      friendName={friendName}
                      content={item.content}
                      time={item.creation_date}
                    />
                  </View>
                ),
              )
            ) : (
              <Text>This is an empty chat</Text>
            )}
          </ScrollView>
          <View style={styles.View.messageFormContainer}>
            <MessageForm friendID={friendId} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Conversation;
