/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../Styles/ChatStyle';
import {useSelector} from 'react-redux';

const MyMessage = props => {
  const userConfig = useSelector(state => state.configuration.userConfig);
  return (
    <View style={styles.myMessage}>
      <Text style={{fontWeight: 'bold', color: 'white'}}>
        {userConfig.first_name} {userConfig.last_name}
      </Text>
      <Text style={{color: 'white'}}>{props.content}</Text>
    </View>
  );
};

export default MyMessage;
