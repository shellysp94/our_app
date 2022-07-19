/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from '../../Styles/ChatStyle';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
const TheirMessage = props => {
  const userConfig = useSelector(state => state.userConfig);

  return (
    <View style={styles.thierMessage}>
      <Text style={{fontWeight: 'bold'}}>{props.friendName}</Text>
      <Text>{props.content}</Text>
    </View>
  );
};

export default TheirMessage;
