/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import {Text, Avatar} from 'react-native-paper';
import axios from 'axios';
import styles from '../Styles/UserProfile';
//FIX ME
//! maybe turn the opacity into a button include the featurs

const UserProfile = props => {
  const config = props.config;
  const [photos, setPhotos] = useState([]);

  const url = 'http://192.168.1.141:3000/userPictures/';
  const getPhotos = async () => {
    try {
      const photos = await axios.get(`${url}${config.user_id}`);
      setPhotos(photos.data);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    getPhotos();
  }, []);
  return (
    <Modal transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.scroll}>
          <Pressable
            style={{height: 30, width: 30, alignSelf: 'flex-start'}}
            onPress={() => props.closeModal()}>
            <Text>X</Text>
          </Pressable>
          <ScrollView>
            <View style={{flexDirection: 'row', width: '100%'}}>
              {
                // photos.map((item, index) => {
                //   return (
                <Avatar.Image
                  size={80}
                  // key={index}
                  style={styles.myPic}
                  source={{uri: `data:image/gif;base64,${photos.image}`}}
                />
                //   );
                // }))
              }
              <View>
                <Text style={styles.title}>
                  {config.first_name} {config.last_name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{}}> Age: {config.age}</Text>
                  <Text style={{}}>Status: {config.relationship_status}</Text>
                </View>
              </View>
              {/* ADD component - arr includes all my picture */}
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Pressable onPress={() => console.log('Chats pressed')}>
                  <Image
                    style={{height: 20, width: 20, marginLeft: 30}}
                    source={require('../Images/Chats.png')}
                  />
                </Pressable>
                <Pressable onPress={() => console.log('Plus pressed')}>
                  <Image
                    style={{height: 20, width: 20, marginLeft: 20}}
                    source={require('../Images/plus.png')}
                  />
                </Pressable>
              </View>
            </View>
            <View style={{width: '90%', alignSelf: 'center', marginTop: 20}}>
              <Text style={{padding: 7}}>Mode: {config.Interesting_In}</Text>
            </View>
            <View style={{width: '90%', alignSelf: 'center', marginTop: 20}}>
              <Text style={{padding: 7}}>City: {config.city}</Text>
              <Text style={{padding: 7}}>Proffesion: {config.profession}</Text>
              <Text style={{padding: 7}}>Hobbies:{config.hobbies}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default UserProfile;
