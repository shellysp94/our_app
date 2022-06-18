/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {View, Text, Image, Button, Pressable, Modal} from 'react-native';
import styles from '../Styles/SignUpStyle';
import {launchImageLibrary} from 'react-native-image-picker'; // Migration from 2.x.x to 3.x.x => showImagePicker API is removed.
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';

const UplaodImageModal = props => {
  const [image1, setImage1] = useState({});
  const [image2, setImage2] = useState({});
  const [image3, setImage3] = useState({});

  const url = 'http://192.168.1.141:3000/userPictures/';
  const conf = useSelector(state => state.userConfig);
  const dispatch = useDispatch();
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

  const uploadImage = async event => {
    try {
      if (image1 !== {}) {
        await axios.post(`${url}${conf.user_id}`, {
          base64image: image1.base64,
          main_image: '1',
        });
      }
      dispatch({
        type: 'UPDATE_MAIN_PICTURE',
        image: image1.base64,
      });
      if (image2 !== {}) {
        //FIX ME - maybe image1 is not main image
        await axios.post(`${url}${conf.user_id}`, {
          base64image: image2.base64,
          main_image: '0',
        });
      }
      if (image3 !== {}) {
        await axios.post(`${url}${conf.user_id}`, {
          base64image: image3.base64,
          main_image: '0',
        });
      }
      props.setVisible(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal transparent={true} visible={props.visible}>
      <View style={styles.modalContainer}>
        <View>
          <View>
            <Pressable onPress={() => props.setVisible(!props.visible)}>
              <Text style={styles.Xbutton}>X</Text>
            </Pressable>
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
                    : require('../Images/Camera.png')
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
                    : require('../Images/Camera.png')
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
                    : require('../Images/Camera.png')
                }
                style={styles.picView}
              />
            </Pressable>
            <View>
              <Button
                color="#0E6070"
                title="Upload"
                onPress={() => uploadImage()}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UplaodImageModal;
