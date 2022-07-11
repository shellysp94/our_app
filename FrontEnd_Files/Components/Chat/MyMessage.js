/* eslint-disable react/prop-types */
import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../Styles/ChatStyle';

const MyMessage = props => {
  console.log('My Message', props.message.content);
  return (
    <View style={styles.myMessage}>
      <Text style={{fontWeight: 'bold'}}>user2</Text>
      <Text>{props.message.content}</Text>
    </View>
  );
};

export default MyMessage;
