/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from '../../Styles/ChatStyle';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
const TheirMessage = props => {
  const userConfig = useSelector(state => state.configuration.userConfig);
  const date = props.time.split('T');
  //console.log(date[1].substring(0, 5));
  //const date = new Date(props.time);
  return (
    <View style={styles.View.thierMessage}>
      <Text style={styles.Text.MessageTitle}>{props.friendName}</Text>
      <Text style={styles.Text.MessageBody}>{props.content}</Text>
      <View style={{alignSelf: 'flex-end'}}>
        <Text>{date[1].substring(0, 5)}</Text>
      </View>
    </View>
  );
};

export default TheirMessage;
