/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import UserItem from '../Components/userItem';

const PendingFriendRequests = props => {
  const userId = useSelector(state => state.configuration.userConfig.user_id);
  const [listOfConf, setlistOfConf] = useState([]);

  const getMyFriendRequest = async () => {
    try {
      const friends = await axios.get(
        `http://192.168.1.141:3000/friendRequest/sendRequests/${userId}`,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        onPress={() => props.setVisible(false)}>
        <Text>X</Text>
      </Pressable>
      <Text>Pending friend request</Text>
      {/* {listOfConf.map(item => {
        return (
          <UserItem
            config={item}
            key={`${item.user_id}`}
            type={'requestsUserSent'}
          />
        );
      })} */}
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
export default PendingFriendRequests;
