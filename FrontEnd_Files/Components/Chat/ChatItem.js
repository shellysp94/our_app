/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../Styles/ChatStyle';
import Theme from '../../Styles/Theme';

const ChatItem = props => {
  const data = props.data;
  const myUserId = useSelector(state => state.configuration.userConfig.user_id);
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.Pressables.item}
      onPress={() => {
        navigation.navigate('Conversation', {
          friendConfig: props.data,
        });
      }}>
      <Pressable style={styles.Pressables.Pressables}>
        <Image
          style={styles.Image.userPic}
          source={{uri: `data:image/gif;base64,${data.image}`}}
        />
      </Pressable>
      <View style={styles.View.row}>
        <View style={styles.View.Details}>
          <Text
            adjustsFontSizeToFit
            style={{...styles.Text.title, alignSelf: 'baseline'}}>
            {data.first_name} {data.last_name}
          </Text>
          <View style={styles.View.row}>
            {data.sender_user_id === myUserId && data.content !== undefined && (
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color={Theme.secondColor}
                style={styles.Icon.sentAndRecieveIcon}
              />
            )}
            {data.sender_user_id !== myUserId && data.content !== undefined && (
              <Ionicons
                name="chatbox-ellipses-outline"
                size={20}
                color={Theme.highLightColor}
                style={styles.Icon.sentAndRecieveIcon}
              />
            )}
            {data.content ? (
              <Text style={styles.Text.body}>{data.content}</Text>
            ) : (
              <Text style={{color: 'gray'}}>The chat is empty</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
