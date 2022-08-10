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
import {useNavigation} from '@react-navigation/native';

const UserItem = props => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const config = props.config;
  const myConfig = useSelector(state => state.configuration.userConfig);
  console.log('friend search mode: ', config.searchMode);
  const navigation = useNavigation();

  const getIcon = item => {
    if (item === 'Food') return require('../assets/icons/hamburger.png');
    if (item === 'Coffee') return require('../assets/icons/coffee-cup.png');
    if (item === 'Training') return require('../assets/icons/sports.png');
    if (item === 'Beer') return require('../assets/icons/toast.png');
    if (item === 'Whatever') return require('../assets/icons/all.png');
    if (item === 'Study') return require('../assets/icons/education.png');
    if (item === 'Shopping') return require('../assets/icons/shopping.png');
  };
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
        `http://192.168.1.141:3000/chats/${myConfig.user_id}/${config.user_id}`,
      );
    } catch {
      alert('in catch');
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
      />

      <Pressable style={{flexDirection: 'row'}} onPress={showModal}>
        <View
          style={{
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '82%',
          }}>
          <View
            style={{
              width: '60%',
              justifyContent: 'center',
            }}>
            <View>
              <View>
                <Text adjustsFontSizeToFit style={styles.friendName}>
                  {config.first_name} {config.last_name}
                </Text>
                {/* <Image
                  style={{left: 5, height: 20, width: 20, alignSelf: 'center'}}
                  source={getIcon(config.searchMode)}
                /> */}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.friendAge}>age: {config.age}</Text>
                <Text style={styles.friendAge}>{config.distance}m</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: '110%',
              flexDirection: 'row',
              alignSelf: 'flex-end',
            }}>
            <Pressable
              style={{justifyContent: 'center'}}
              onPress={() => onPressType(props.type)}>
              {typeIcon}
            </Pressable>
            <View
              style={{
                justifyContent: 'flex-end',
                marginLeft: 10,
                right: -5,
                bottom: -5,
              }}>
              <Ionicons
                style={{alignSelf: 'flex-end'}}
                name="ellipse"
                size={12}
                color={'#4cbb17'}
              />
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
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    borderRadius: 10,
    margin: 3,
  },
  Picture: {
    width: 50,
    height: 50,
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
