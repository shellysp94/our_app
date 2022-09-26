/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {View, Image, ScrollView, Pressable, Modal} from 'react-native';
import {Text} from 'react-native-paper';
import axios from 'axios';
import {useSelector} from 'react-redux';
import styles from '../Styles/UserProfile';
import {getCurrentPath} from '../utils/generalFunctions';
import Theme from '../Styles/Theme';

const UserProfile = props => {
  const config = props.config;
  const [photos, setPhotos] = useState([]);
  const path = getCurrentPath();
  const verifyToken = useSelector(state => state.configuration.token);

  const getPhotos = async () => {
    try {
      const res = await axios.get(`${path}/userPictures/${config.user_id}`, {
        headers: {
          authorization: 'bearer ' + verifyToken,
        },
      });
      setPhotos(res.data);
    } catch (error) {
      console.error(error);
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
            <Text style={{fontFamily: Theme.fontFamilyBold}}>X</Text>
          </Pressable>
          <ScrollView>
            <View style={{width: '100%', justifyContent: 'center'}}>
              <View>
                <Text style={styles.title}>
                  {config.first_name} {config.last_name}
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontFamily: Theme.fontFamilyRegular,
                      alignSelf: 'center',
                    }}>
                    {config.age} , {config.relationship_status} ,
                    {config.sexual_orientation}
                  </Text>
                </View>
              </View>
              <ScrollView
                contentContainerStyle={{justifyContent: 'center'}}
                style={{flex: 1, alignSelf: 'center', marginTop: 15}}
                horizontal={true}>
                {photos.map((item, index) => {
                  return (
                    <Image
                      key={index}
                      style={styles.Pic}
                      source={{
                        uri: `data:image/gif;base64,${item.image}`,
                      }}
                    />
                  );
                })}
              </ScrollView>
            </View>

            <View style={{width: '90%', alignSelf: 'center', marginTop: 20}}>
              <Text style={{padding: 7, fontFamily: Theme.fontFamilyRegular}}>
                Search Mode: {config.search_mode}
              </Text>
              <Text style={{padding: 7, fontFamily: Theme.fontFamilyRegular}}>
                City: {config.city}
              </Text>
              <Text style={{padding: 7, fontFamily: Theme.fontFamilyRegular}}>
                Proffesion: {config.profession}
              </Text>
              <Text style={{padding: 7, fontFamily: Theme.fontFamilyRegular}}>
                Hobbies: {config.hobbies}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default UserProfile;
