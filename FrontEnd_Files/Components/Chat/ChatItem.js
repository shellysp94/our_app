/* eslint-disable no-prototype-builtins */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import {Avatar} from 'react-native-paper';
import styles from '../../Styles/ChatStyle';
import {useNavigation} from '@react-navigation/native';

const ChatItem = props => {
  const data = props.data;
  const navigation = useNavigation();
  const navi = () => {
    navigation.navigate('Conversation', {
      friendConfig: props.data,
    });
  };

  return (
    //FIX ME how to move to certain conversation with certain user
    <Pressable style={styles.Pressable.item} onPress={() => navi()}>
      <Pressable style={styles.Pressable.Pressables}>
        <Image
          style={styles.Image.userPic}
          source={{uri: `data:image/gif;base64,${data.image}`}}
        />
      </Pressable>
      <View style={styles.View.row}>
        <View style={styles.View.Details}>
          <Text style={styles.Text.title}>
            {data.first_name} {data.last_name}
          </Text>
          {data.hasOwnProperty('content') ? (
            <Text style={styles.Text.body}>{data.content}</Text>
          ) : (
            <Text style={{color: 'gray'}}>The chat is empty</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
