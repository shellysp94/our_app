/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable, Button} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Theme from '../Styles/Theme';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import UserProfile from '../Components/UserProfile';
import {getCurrentPath} from '../utils/generalFunctions';

const UserItem = props => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const config = props.config;
  const myConfig = useSelector(state => state.configuration.userConfig);
  const navigation = useNavigation();
  const myStatus = config.user_status;
  const verifyToken = useSelector(state => state.configuration.token);
  const path = getCurrentPath();
  const typeIcon = () => {
    if (props.type === 'notFriend')
      return (
        <View
          style={{
            backgroundColor: 'blue',
            justifyContent: 'center',
            borderRadius: 7,
            width: 130,
            height: 30,
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              alignSelf: 'center',
            }}>
            Let's connect
          </Text>
        </View>
      );

    if (props.type === 'friend') {
      return (
        <View
          style={{
            backgroundColor: 'green',
            justifyContent: 'center',
            borderRadius: 7,
            width: 130,
            height: 30,
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              alignSelf: 'center',
            }}>
            Let's Chat
          </Text>
        </View>
      );
    }
    if (props.type === 'requestsUserSent') {
      return (
        <View
          style={{
            backgroundColor: 'orange',
            justifyContent: 'center',
            borderRadius: 7,
            width: 130,
            height: 30,
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              alignSelf: 'center',
            }}>
            Pending{' '}
          </Text>
        </View>
      );
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
      const res = await axios.post(
        `${path}/chats/${myConfig.user_id}/${config.user_id}`,
        {},
        {
          headers: {
            authorization: 'bearer ' + verifyToken,
          },
        },
      );
    } catch (err) {
      console.error(err);
    }
  };
  const onPressType = type => {
    if (props.type === 'notFriend') {
      props.function(config.user_id);
    } else if (props.type === 'friend') {
      console.log("let's start new chat ");
      createNewChat();
      navigation.navigate('Chats');
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
        config={config}
      />

      <Pressable
        onPress={() => {
          showModal();
        }}
        style={{flexDirection: 'row', height: '100%'}}>
        <View
          style={{
            alignSelf: 'baseline',
            paddingRight: 10,
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
            justifyContent: 'space-between',
            width: '82%',
          }}>
          <View
            style={{
              width: '90%',
              marginTop: 15,
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text adjustsFontSizeToFit style={styles.friendName}>
                {config.first_name} {config.last_name}
              </Text>

              <Ionicons
                style={{alignSelf: 'center', marginLeft: 10}}
                name="ellipse"
                size={14}
                color={config.online ? '#4cbb17' : '#E11B1B'}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.friendAge}>age: {config.age}</Text>
              {config.distance !== null && (
                <Text style={styles.friendAge}>
                  {parseInt(config.distance, 10)}m
                </Text>
              )}
            </View>
            <View style={{marginTop: 5}}>
              <Text> {config.search_mode} </Text>
            </View>
            <View style={{marginTop: 5}}>
              <Text> {myStatus} </Text>
            </View>
            <View style={{marginTop: 20, alignSelf: 'center'}}>
              <Pressable
                style={{justifyContent: 'center', width: '40%'}}
                onPress={() => onPressType(props.type)}>
                {typeIcon}
              </Pressable>
            </View>
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
    height: 200,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    borderRadius: 10,
    margin: 15,
  },
  Picture: {
    width: 50,
    height: 50,
    marginTop: 15,
    borderRadius: 25,
  },
  Details: {
    // marginRight: 40,
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
