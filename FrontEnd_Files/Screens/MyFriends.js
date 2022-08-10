/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  Pressable,
  Modal,
} from 'react-native';
import axios from 'axios';
import UserItem from '../Components/userItem';
import styles from '../Styles/MyFriendsStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import PendingFriendRequests from '../Components/PendingFriendRequests';
import MyFriendRequests from '../Components/MyFriendRequests';
import UpperBar from '../Components/UpperBar';
import {updateMyFriends, searchFriend} from '../store/Slices/peopleSlice';

const MyFriends = () => {
  const [friendName, setFriendName] = useState(friendToSearch);
  const [visibleMyRequests, setVisibleMyRequests] = useState(false);
  const [visiblePendingRequests, setVisiblePendingRequests] = useState(false);
  const userConfig = useSelector(state => state.configuration.userConfig);
  const listOfConf = useSelector(state => state.people.myFriends);
  console.log(listOfConf);
  const friendToSearch = useSelector(state => state.people.friendToSearch);
  const dispatch = useDispatch();

  const FindFriend = async () => {
    const valToSearch = friendToSearch === '' ? '%20' : friendToSearch;
    try {
      const friends = await axios.get(
        `http://192.168.1.141:3000/connections///byName/${userConfig.user_id}/1/${valToSearch}`,
      );
      if (friends.data.hasOwnProperty('msg')) {
        alert(friends.data.msg); // there are no connections?
      } else {
        dispatch(
          updateMyFriends({
            myFriends: friends.data,
          }),
        );
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    FindFriend();
  }, []);
  useEffect(() => {
    FindFriend();
  }, [friendToSearch, visibleMyRequests, visiblePendingRequests]);

  return (
    <View style={styles.container}>
      <UpperBar title={'My Friends'} />

      <Modal transparent={true} visible={visibleMyRequests}>
        <MyFriendRequests setVisible={setVisibleMyRequests} />
      </Modal>
      <Modal transparent={true} visible={visiblePendingRequests}>
        <PendingFriendRequests setVisible={setVisiblePendingRequests} />
      </Modal>
      <View style={styles.searchFriend}>
        <TextInput
          style={styles.textInput}
          placeholder={`Search a friend`}
          onChangeText={val => setFriendName(val)}
        />
        <Pressable
          style={styles.searchButton}
          onPress={() => {
            dispatch(searchFriend({friendToSearch: friendName}));
          }}>
          <Text style={styles.searchText}>Search</Text>
        </Pressable>
        <Pressable
          style={styles.trashPressable}
          onPress={() => {
            dispatch(searchFriend({friendToSearch: ''}));
          }}>
          <Ionicons
            color={'#122b1b'}
            size={20}
            style={styles.trashIcon}
            name={'trash-outline'}
          />
        </Pressable>
      </View>
      <View style={styles.pressableContaner}>
        <Pressable
          style={styles.requestPressable}
          onPress={() => setVisibleMyRequests(true)}>
          <Text style={styles.requestText}>My friend requests</Text>
        </Pressable>
        <Pressable
          style={styles.requestPressable}
          onPress={() => setVisiblePendingRequests(true)}>
          <Text style={styles.requestText}>Pending friend request</Text>
        </Pressable>
      </View>
      <SafeAreaView style={styles.listOfConfContainer}>
        {listOfConf.map(item => {
          return (
            <UserItem config={item} key={`${item.user_id}`} type={'friend'} />
          );
        })}
      </SafeAreaView>
    </View>
  );
};

export default MyFriends;
