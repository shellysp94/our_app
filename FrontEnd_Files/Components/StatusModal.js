/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {updateMyStatus} from '../store/Slices/generalSlice';
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Modal,
  Text,
} from 'react-native';
import axios from 'axios';
import styles from '../Styles/StatusModal';
import Theme from '../Styles/Theme';
import {getCurrentPath} from '../utils/generalFunctions';

const StatusModal = props => {
  const path = getCurrentPath();
  const dispatch = useDispatch();
  const [myStatus, setStatus] = useState('enter your status...');
  const user_id = useSelector(state => state.configuration.userConfig.user_id);
  const verifyToken = useSelector(state => state.configuration.token);
  const updateStatus = async () => {
    try {
      const res = await axios.post(
        `${path}/userStatus/${user_id}`,
        {
          status: myStatus,
        },
        {
          headers: {
            Authorization: 'Bearer ' + verifyToken,
          },
        },
      );
      dispatch(updateMyStatus({status: res.data[0].user_status}));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <Modal transparent={true} visible={props.visible}>
        <View style={styles.container}>
          <View style={styles.scroll}>
            <Pressable
              style={{height: 30, width: 30, alignSelf: 'flex-start'}}
              onPress={() => {
                props.setVisible(false);
                props.closeModal();
              }}>
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
              onChangeText={val => setStatus(val)}
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
    </KeyboardAvoidingView>
  );
};

export default StatusModal;
