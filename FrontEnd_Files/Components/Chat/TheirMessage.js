/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from '../../Styles/ChatStyle';
import {View, Text} from 'react-native';

const TheirMessage = props => {
  return (
    <View style={styles.thierMessage}>
      <Text style={{fontWeight: 'bold'}}>user2</Text>
      <Text>{props.content}</Text>
    </View>
  );
};

export default TheirMessage;
