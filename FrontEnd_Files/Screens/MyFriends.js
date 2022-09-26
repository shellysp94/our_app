/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
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
import {getCurrentPath} from '../utils/generalFunctions';

const MyFriends = () => {
  const path = getCurrentPath();
  const [friendName, setFriendName] = useState(friendToSearch);
  const [visibleMyRequests, setVisibleMyRequests] = useState(false);
  const [visiblePendingRequests, setVisiblePendingRequests] = useState(false);
  const userConfig = useSelector(state => state.configuration.userConfig);
  const listOfConf = useSelector(state => state.people.myFriends);
  const friendToSearch = useSelector(state => state.people.friendToSearch);
  const dispatch = useDispatch();
  const verifyToken = useSelector(state => state.configuration.token);
  const refresh = useSelector(state => state.general.refresh);
  const myLongitude = useSelector(state => state.general?.myLongitude);
  const myLatitude = useSelector(state => state.general?.myLatitude);

  //Search friend by name
  const FindFriend = useCallback(async () => {
    try {
      const valToSearch = friendToSearch === '' ? '%20' : friendToSearch;
      const friends = await axios.get(
        `${path}/friendRequest/byName/${userConfig.user_id}/1/${valToSearch}`,
        {
          headers: {
            Authorization: 'Bearer ' + verifyToken,
          },
        },
      );
      dispatch(
        updateMyFriends({
          myFriends: friends.data,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    FindFriend();
  }, [
    friendToSearch,
    visibleMyRequests,
    visiblePendingRequests,
    refresh,
    myLongitude,
    myLatitude,
  ]);

  return (
    <View style={styles.View.container}>
      <UpperBar />
      {/*Those two modals are Showing two lists: 1) those are awaiting my approval 2) those I sent */}
      <Modal transparent={true} visible={visibleMyRequests}>
        <MyFriendRequests setVisible={setVisibleMyRequests} />
      </Modal>
      <Modal transparent={true} visible={visiblePendingRequests}>
        <PendingFriendRequests setVisible={setVisiblePendingRequests} />
      </Modal>
      <View style={styles.View.searchFriend}>
        <TextInput
          style={styles.textInput.textInput}
          placeholder={`Search a friend`}
          onChangeText={val => setFriendName(val)}
        />
        <Pressable
          style={styles.Pressable.searchButton}
          onPress={() => {
            dispatch(searchFriend({friendToSearch: friendName}));
          }}>
          <Text style={styles.Text.searchText}>Search</Text>
        </Pressable>
        <Pressable
          style={styles.Pressable.trashPressable}
          onPress={() => {
            dispatch(searchFriend({friendToSearch: ''}));
          }}>
          <Ionicons
            color={'#122b1b'}
            size={20}
            style={styles.Icon.trashIcon}
            name={'trash-outline'}
          />
        </Pressable>
      </View>
      <View style={styles.View.pressableContaner}>
        <Pressable
          style={styles.Pressable.requestPressable}
          onPress={() => setVisibleMyRequests(true)}>
          <Text adjustsFontSizeToFit style={styles.Text.requestText}>
            My friend requests
          </Text>
        </Pressable>
        <Pressable
          style={styles.Pressable.requestPressable}
          onPress={() => setVisiblePendingRequests(true)}>
          <Text adjustsFontSizeToFit style={styles.Text.requestText}>
            Pending friend request
          </Text>
        </Pressable>
      </View>
      <ScrollView style={styles.SafeAreaView.listOfConfContainer}>
        {!listOfConf.hasOwnProperty('msg') &&
          listOfConf.map((item, index) => {
            return <UserItem config={item} key={index} type={'friend'} />;
          })}
      </ScrollView>
    </View>
  );
};

export default MyFriends;
