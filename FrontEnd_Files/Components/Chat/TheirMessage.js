/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from '../../Styles/ChatStyle';
import {View, Text} from 'react-native';

const TheirMessage = props => {
  const date = props.time.split('T');

  return (
    <View style={styles.View.theirMessage}>
      <Text style={styles.Text.MessageBody}>{props.content}</Text>
      <View style={{alignSelf: 'flex-end'}}>
        <Text style={styles.Text.theirMessageTime}>
          {date[1].substring(0, 5)}
        </Text>
      </View>
    </View>
  );
};

export default TheirMessage;
