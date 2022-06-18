// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from '../Styles/ChatStyle';
import {View} from 'react-native';
import MessageForm from '../Components/Chat/MessageForm';
import MyMessage from '../Components/Chat/MyMessage';
import TheirMessage from '../Components/Chat/TheirMessage';

const Conversation = () => {
  const messagesState = ['hi!', 'hello', 'whats up?'];
  console.log(messagesState);
  return (
    <View>
      <View style={styles.chatFeed}>
        {messagesState.map((item, index) => (
          <View key={`msg_${index}`} style={styles.messageBlock}>
            {index % 2 ? (
              <MyMessage message={item} />
            ) : (
              <TheirMessage message={item} />
            )}
          </View>
        ))}
      </View>
      <View style={styles.messageFormContainer}>
        <MessageForm lst={messagesState} />
      </View>
    </View>
  );
};

export default Conversation;
