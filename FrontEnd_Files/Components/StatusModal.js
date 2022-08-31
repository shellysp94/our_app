/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {updateMyStatus} from '../store/Slices/generalSlice';
import {View, TextInput, Pressable, Modal, Text} from 'react-native';
import axios from 'axios';
import styles from '../Styles/StatusModal';
import Theme from '../Styles/Theme';
//FIX ME
//! maybe turn the opacity into a button include the featurs

const StatusModal = props => {
  useEffect(() => {}, []);
  const [myStatus, setStatus] = useState('enter your status...');
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.configuration.userConfig.user_id);

  const updateStatus = async () => {
    try {
      const res = await axios.post(
        `http://192.168.1.141:3000/userStatus/${user_id}`, //NOTICE: use this url or another?
        {status: myStatus},
      );
      dispatch(updateMyStatus({status: myStatus}));
    } catch (err) {
      alert(err);
    }
  };
  return (
    <Modal transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View style={styles.scroll}>
          <Pressable
            style={{height: 30, width: 30, alignSelf: 'flex-start'}}
            onPress={() => props.closeModal()}>
            <Text>X</Text>
          </Pressable>

          <View>
            <Text style={styles.title}>Update your status</Text>
          </View>
          <TextInput
            style={{
              height: 120,
              margin: 12,
              borderWidth: 1,
              padding: 10,
            }}
            onChangeText={setStatus}
          />
          <Pressable
            style={{
              height: 50,
              width: 120,
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: Theme.highLightColor,
              borderRadius: 10,
            }}
            onPress={() => {
              updateStatus();
              props.closeModal();
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: Theme.fontFamilyBold,
                fontSize: 18,
              }}>
              Update
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;
