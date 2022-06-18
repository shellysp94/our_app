import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  Button,
} from 'react-native';
import UserProfile from './UserProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserItem = props => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const config = props.config;

  const typeIcon = () => {
    if (props.type === 'notFriend')
      return <Ionicons name="person-add-outline" size={30} />;

    if (props.type === 'friend') {
      return <Ionicons name="chatbubble-ellipses-outline" size={30} />;
    }
    if (props.type === 'requestsUserSent') {
      return <Button title={'Pending'} color={'orange'} />;
      //return <Ionicons name="add-circle-outline" size={30} />;
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

  const onPressType = () => {
    if (props.type === 'notFriend') {
      props.function(config.user_id);
    }
    if (props.type === 'friend') {
      alert("let's start new chat ");
    }
    if (props.type === 'requestsUserReceived') {
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
            <View>
              <Text style={styles.friendAge}>age: {config.age}</Text>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row',
              alignSelf: 'flex-end',
              justifyContent: 'center',
            }}>
            <Pressable onPress={() => onPressType()}>{typeIcon}</Pressable>
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
    // borderColor: '#614051',
    // borderWidth: 1,
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
    color: '#122b1b',
    fontWeight: 'bold',
    alignItems: 'flex-start',
  },
  friendAge: {
    fontSize: 18,
    alignItems: 'flex-start',
    color: '#122b1b',
    fontWeight: 'bold',
  },
});

export default UserItem;
