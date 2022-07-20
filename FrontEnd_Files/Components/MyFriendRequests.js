/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-alert */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import UserItem from '../Components/userItem';

const MyFriendRequests = props => {
  const [listOfConf, setlistOfConf] = useState([]);
  const userConfig = useSelector(state => state.configuration.userConfig);
  const user_id = userConfig.user_id;

  const onAccept = async userNum => {
    try {
      await axios.post(
        `http://192.168.1.141:3000/friendRequest/approve/${user_id}/${userNum}`,
      );
      getMyFriendRequest(); //FIX ME
    } catch (error) {
      alert(error);
    }
  };

  const getMyFriendRequest = async () => {
    try {
      const friends = await axios.get(
        `http://192.168.1.141:3000/friendRequest/recievedRequests/${userConfig.user_id}`,
      );
      if (!friends.data.hasOwnProperty('msg')) {
        setlistOfConf([...friends.data]);
      }
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    getMyFriendRequest();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        onPress={() => props.setVisible(false)}>
        <Text>X</Text>
      </Pressable>
      <Text>My friend request</Text>
      {listOfConf &&
        listOfConf.map(item => {
          return (
            <UserItem
              config={item}
              key={`${item.user_id}`}
              type={'requestsUserReceived'}
              function={onAccept}
            />
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    elevation: 10,
    backgroundColor: '#ffff',
    height: '80%',
    width: '90%',
    marginTop: 80,
    alignSelf: 'center',
  },
  pressable: {
    height: 30,
    width: 30,
    alignSelf: 'flex-start',
  },
});

export default MyFriendRequests;
