/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {Avatar} from 'react-native-paper';
import styles from '../../Styles/ChatStyle';
import {useNavigation} from '@react-navigation/native';

const ChatItem = props => {
  const data = props.data;
  const navigation = useNavigation();
  const navi = () => {
    console.log(data);
    navigation.navigate('Conversation', {
      userId: data.user_B_id,
    });
  };

  return (
    //FIX ME how to move to certain conversation with certain user
    <Pressable style={styles.item} onPress={() => navi()}>
      <Pressable style={styles.Pressables}>
        <Avatar.Icon size={35} />
      </Pressable>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={styles.Details}>
          <Text style={styles.title}>{data.chat_id}</Text>
          <Text style={styles.body}>last message</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text>creation date</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
