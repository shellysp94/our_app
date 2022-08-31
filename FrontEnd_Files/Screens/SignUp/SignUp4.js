/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import React, {useState} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {updateMainPictuer} from '../../store/Slices/configurationSlice';
import styles from '../../Styles/SignUpStyle';
import Theme from '../../Styles/Theme';

const SignUp4 = props => {
  const [image1, setImage1] = useState({});
  const [image2, setImage2] = useState({});
  const [image3, setImage3] = useState({});
  const conf = useSelector(state => state.configuration.userConfig);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const pickImage = num => {
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: true, maxHeight: 200, maxWidth: 200},
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          if (num === 1) setImage1({...response.assets[0]});
          if (num === 2) setImage2({...response.assets[0]});
          if (num === 3) setImage3({...response.assets[0]});
        }
      },
    );
  };

  const uploadImage = async () => {
    try {
      if (image1 !== {}) {
        await axios.post(
          `http://192.168.1.141:3000/userPictures/${conf.user_id}`,
          {
            base64image: image1.base64,
            main_image: '1',
          },
        );
      }
      dispatch(
        updateMainPictuer({
          image: image1.base64,
        }),
      );
      if (image2 !== {}) {
        //FIX ME - maybe image1 is not main image
        await axios.post(
          `http://192.168.1.141:3000/userPictures/${conf.user_id}`,
          {
            base64image: image2.base64,
            main_image: '0',
          },
        );
      }
      if (image3 !== {}) {
        await axios.post(
          `http://192.168.1.141:3000/userPictures/${conf.user_id}`,
          {
            base64image: image3.base64,
            main_image: '0',
          },
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.modalContainer}>
      <View>
        <View>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.title}>Add some pictures</Text>
          <Text style={styles.subText}>You must add at least 1 picture</Text>
          <Text style={styles.subText}>upload only JPEG/ JPG/ PNG</Text>
        </View>
        <View style={styles.addPicSection}>
          <Pressable onPress={() => pickImage(1)}>
            <Image
              source={
                image1 !== {}
                  ? {
                      uri: image1.uri,
                    }
                  : require('../../assets/Images/Camera.png')
              }
              style={styles.mainPic}
            />
          </Pressable>

          <Pressable onPress={() => pickImage(2)}>
            <Image
              source={
                image2 !== {}
                  ? {
                      uri: image2.uri,
                    }
                  : require('../../assets/Images/Camera.png')
              }
              style={styles.picView}
            />
          </Pressable>

          <Pressable onPress={() => pickImage(3)}>
            <Image
              source={
                image3 !== {}
                  ? {
                      uri: image3.uri,
                    }
                  : require('../../assets/Images/Camera.png')
              }
              style={styles.picView}
            />
          </Pressable>
          <View>
            <Pressable
              style={{
                backgroundColor: Theme.secondColor,
                padding: 6,
                width: 120,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => uploadImage()}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: Theme.fontFamilyBold,
                  color: '#FFFFFF',
                }}>
                Upload
              </Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              style={{
                backgroundColor: Theme.highLightColor,
                padding: 6,
                width: 120,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={() => navigation.navigate('Log In stack')}>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: Theme.fontFamilyBold,
                  color: '#FFFFFF',
                }}>
                Skip
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUp4;
