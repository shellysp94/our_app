/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/NotificationStyle';

const NotificationItem = props => {
  return (
    <View style={styles.item}>
      <Pressable style={styles.Pressables}>
        <Ionicons
          name="notifications-outline"
          size={35}
          color={'#0E6070'}
          style={styles.iconItem}
        />
      </Pressable>
      <View style={styles.row}>
        <View style={styles.Details}>
          <Text style={styles.title}>{props.details.title}</Text>
          <Text style={styles.body}>{props.details.content}</Text>
        </View>
      </View>
    </View>
  );
};

export default NotificationItem;
