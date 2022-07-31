/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../Styles/ChatStyle';
import {useSelector} from 'react-redux';

const MyMessage = props => {
  const userConfig = useSelector(state => state.configuration.userConfig);
  const date = props.time.split('T');

  return (
    <View style={styles.View.myMessage}>
      {/* <Text style={{...styles.Text.MessageTitle, color: 'white'}}>
        {userConfig.first_name} {userConfig.last_name}
      </Text> */}
      <Text style={{...styles.Text.MessageBody, color: 'white'}}>
        {props.content}
      </Text>
      <View style={{alignSelf: 'flex-end'}}>
        <Text style={styles.Text.myMessageTime}>{date[1].substring(0, 5)}</Text>
      </View>
    </View>
  );
};

export default MyMessage;
