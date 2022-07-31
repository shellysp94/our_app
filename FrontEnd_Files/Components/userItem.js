/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable, Button} from 'react-native';
import UserProfile from './UserProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Theme from '../Styles/Theme';
import {useSelector} from 'react-redux';
import {tSObjectKeyword} from '@babel/types';

const UserItem = props => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const config = props.config;
  const myConfig = useSelector(state => state.configuration.userConfig);

  const typeIcon = () => {
    if (props.type === 'notFriend')
      return <Ionicons name="person-add-outline" size={30} />;

    if (props.type === 'friend') {
      return <Ionicons name="chatbubble-ellipses-outline" size={30} />;
    }
    if (props.type === 'requestsUserSent') {
      return <Button title={'Pending'} color={'orange'} />;
    } else {
      return (
        <Button
          title={'Accept'}
          color={'green'}
          onPress={() => props.function(config.user_id)}
        />
      );
    }
  };
  const createNewChat = async () => {
    try {
      await axios.post(
        `http://192.168.1.103:3000/chats/${myConfig.user_id}/${config.user_id}`,
      );
    } catch {
      alert('in catch');
    }
  };
  const onPressType = type => {
    console.log(type);
    if (props.type === 'notFriend') {
      props.function(config.user_id);
    } else if (props.type === 'friend') {
      console.log("let's start new chat ");
      createNewChat();
    } else if (props.type === 'requestsUserReceived') {
      props.function(config.user_id);
    } else {
      alert('friend request issues');
    }
  };

  return (
    <View style={styles.UserItem}>
      <UserProfile
        visible={visible}
        setVisible={setVisible}
        {...props}
        closeModal={hideModal}
      />

      <Pressable style={{flexDirection: 'row'}} onPress={showModal}>
        <View
          style={{
            paddingRight: 20,
            justifyContent: 'center',
          }}>
          {config.image && (
            <Image
              style={styles.Picture}
              source={{uri: `data:image/gif;base64,${config.image}`}}
            />
          )}
        </View>
        <View
          style={{
            width: '80%',
            justifyContent: 'center',
          }}>
          <View style={styles.Details}>
            <View>
              <Text style={styles.friendName}>
                {config.first_name} {config.last_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 200,
              }}>
              <Text style={styles.friendAge}>age: {config.age}</Text>
              <Text style={styles.friendAge}>distance: ??</Text>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              alignSelf: 'flex-end',
              justifyContent: 'center',
            }}>
            <Pressable onPress={() => onPressType(props.type)}>
              {typeIcon}
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  UserItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  Picture: {
    width: 40,
    height: 40,
  },
  Details: {
    paddingRight: 40,
    alignContent: 'flex-start',
  },
  friendName: {
    fontSize: 22,
    fontFamily: Theme.fontFamilyBold,
    color: '#000729',
    alignItems: 'flex-start',
  },
  friendAge: {
    fontSize: 18,
    alignItems: 'flex-start',
    color: Theme.secondColor,
    fontFamily: Theme.fontFamilyRegular,
  },
});

export default UserItem;
