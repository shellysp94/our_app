/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
const UpperBar = props => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: '100%',
        zIndex: 1,
        marginBottom: 50,
      }}>
      <Pressable
        style={{position: 'absolute', zIndex: 1, margin: 10}}
        onPress={() =>
          props.title === 'Nearby people'
            ? navigation.getParent().openDrawer()
            : navigation.openDrawer()
        }>
        <Ionicons name="menu-outline" size={30} color={'#FFFFFF'} />
      </Pressable>
    </View>
  );
};

export default UpperBar;
