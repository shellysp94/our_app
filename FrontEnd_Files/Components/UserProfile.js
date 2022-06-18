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
      <View
        style={{
          padding: 20,
          elevation: 10,
          backgroundColor: '#ffff',
          height: '80%',
          width: '90%',
          marginTop: 80,
          alignSelf: 'center',
        }}>
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
                <Text style={{padding: 7}}>City</Text>
                <Text style={{padding: 7}}>Proffesion</Text>
                <Text style={{padding: 7}}>Hobbies</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    borderColor: '#0E6070',
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
    height: '100%',
    marginBottom: 5,
  },
  Pic: {
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 40,
    height: 60,
    width: 60,
    marginRight: 15,
  },
  addPic: {
    //marginTop: 10,
    borderColor: '#0E6070',
    borderWidth: 1,
    borderRadius: 20,
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
  fullName: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  title: {
    color: '#0E6070',
    fontSize: 30,
    alignSelf: 'center',
  },
});

export default UserProfile;
