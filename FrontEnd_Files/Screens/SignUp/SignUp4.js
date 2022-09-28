/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {
  setTempPictures,
  uploadImages,
  uploadMainImage,
  clearMyPictures,
} from '../../store/Slices/picturesSlice';
import styles from '../../Styles/SignUpStyle';
import Theme from '../../Styles/Theme';
import {getCurrentPath} from '../../utils/generalFunctions';

const SignUp4 = ({route, navigation}) => {
  const {page} = route.params;
  const path = getCurrentPath();
  const [isMain, setIsMain] = useState(false);
  const myPictures = useSelector(state => state.pictures?.myPictures);
  const tempPictures = useSelector(state => state.pictures?.tempPictures);
  const conf = useSelector(state => state.configuration.userConfig);
  const verifyToken = useSelector(state => state.configuration.token);
  const dispatch = useDispatch();
  console.log(conf);
  useEffect(() => {
    if (page !== 'SignUp3') {
      if (!myPictures[0]?.isGen) {
        //if the first image is not generic
        setIsMain(true);
        dispatch(setTempPictures({key: 0, value: myPictures[0]?.image}));
      } else {
        //if the first image is generic
        dispatch(clearMyPictures());
        setIsMain(false);
      }
      if (myPictures && myPictures[1] !== undefined)
        dispatch(setTempPictures({key: 1, value: myPictures[1]?.image}));
      if (myPictures && myPictures[2] !== undefined)
        dispatch(setTempPictures({key: 2, value: myPictures[2]?.image}));
    }
  }, []);

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
          console.error(response.customButton);
        } else {
          if (num === 1 && !isMain)
            dispatch(
              setTempPictures({key: 0, value: response.assets[0].base64}),
            );
          if (num === 2) {
            dispatch(
              setTempPictures({key: 1, value: response.assets[0].base64}),
            );
          }
          if (num === 3)
            dispatch(
              setTempPictures({key: 2, value: response.assets[0].base64}),
            );
        }
      },
    );
  };

  const uploadImage = async () => {
    try {
      if (tempPictures[0] !== undefined && !myPictures[0]) {
        await axios.post(
          `${path}/userPictures/${conf.user_id}`,
          {
            base64image: tempPictures[0].image,
            main_image: '1',
          },
          {
            headers: {
              Authorization: 'Bearer ' + verifyToken,
            },
          },
        );
        dispatch(uploadMainImage({myMain: tempPictures[0]}));
      }
      if (tempPictures[1] !== undefined) {
        await axios.post(
          `${path}/userPictures/${conf.user_id}`,
          {
            base64image: tempPictures[1].image,
            main_image: '0',
          },
          {
            headers: {
              Authorization: 'Bearer ' + verifyToken,
            },
          },
        );
      }
      if (tempPictures[2] !== undefined) {
        await axios.post(
          `${path}/userPictures/${conf.user_id}`,
          {
            base64image: tempPictures[2].image,
            main_image: '0',
          },
          {
            headers: {
              Authorization: 'Bearer ' + verifyToken,
            },
          },
        );
      }
      dispatch(uploadImages({myPictures: tempPictures}));
      page === 'SignUp3'
        ? navigation.navigate('Log In stack')
        : navigation.navigate('My Profile');
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
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Pressable
              disabled={isMain}
              style={{justifyContent: 'center'}}
              onPress={() => pickImage(1)}>
              <Image
                source={
                  tempPictures[0] !== undefined
                    ? {uri: `data:image/gif;base64,${tempPictures[0].image}`}
                    : require('../../assets/Images/Camera.png')
                }
                style={styles.mainPic}
              />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Pressable
              style={{justifyContent: 'center'}}
              onPress={() => pickImage(2)}>
              <Image
                source={
                  tempPictures[1] !== undefined
                    ? {uri: `data:image/gif;base64,${tempPictures[1].image}`}
                    : require('../../assets/Images/Camera.png')
                }
                style={styles.picView}
              />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <Pressable
              style={{justifyContent: 'center'}}
              onPress={() => pickImage(3)}>
              <Image
                source={
                  tempPictures[2] !== undefined
                    ? {uri: `data:image/gif;base64,${tempPictures[2].image}`}
                    : require('../../assets/Images/Camera.png')
                }
                style={styles.picView}
              />
            </Pressable>
          </View>
          <View>
            <Pressable
              style={styles.uploadImagePressable}
              onPress={() => uploadImage()}>
              <Text style={styles.uploadText}>Upload</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              style={styles.skipPressble}
              onPress={() => {
                page === 'SignUp3'
                  ? navigation.navigate('Log In stack')
                  : navigation.navigate('My Profile');
              }}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUp4;
