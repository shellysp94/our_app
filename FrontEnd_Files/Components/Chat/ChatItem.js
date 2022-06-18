import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {Avatar} from 'react-native-paper';
import styles from '../../Styles/ChatStyle';
import {useNavigation} from '@react-navigation/native';

const ChatItem = () => {
  const navigation = useNavigation();
  const navi = () => {
    navigation.navigate('Conversation');
  };

  return (
    <Pressable style={styles.item} onPress={() => navi()}>
      <Pressable style={styles.Pressables}>
        <Avatar.Icon size={35} style={{backgroundColor: '#0E6070'}} />
      </Pressable>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={styles.Details}>
          <Text style={styles.title}>Friend Name</Text>
          <Text style={styles.body}>last message</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            position: 'absolute',
            right: 0,
            alignSelf: 'center',
          }}>
          <Text>creation date</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
