// eslint-disable-next-line no-unused-vars
import React from 'react';
import {View} from 'react-native';
import ChatItem from '../Components/Chat/ChatItem';
import styles from '../Styles/ChatStyle';
import UpperBar from '../Components/UpperBar';

const Chat = () => {
  return (
    <View style={styles.manageChatsContainer}>
      <UpperBar title={'Chats'} />
      <View>
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
        <ChatItem />
      </View>
    </View>
  );
};

export default Chat;
