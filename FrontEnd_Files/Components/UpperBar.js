/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const UpperBar = props => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        margin: 10,
        flexDirection: 'row',
        marginBottom: 50,
      }}>
      <Pressable
        style={{position: 'absolute', zIndex: 1}}
        onPress={() =>
          props.title === 'Nearby people'
            ? navigation.getParent().openDrawer()
            : navigation.openDrawer()
        }>
        <Ionicons name="menu-outline" size={30} color={'#FFFFFF'} />
      </Pressable>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>{props.title}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
    position: 'absolute',
    width: '100%',
    height: 30,
  },
  text: {
    left: 40,
    color: 'white',
    fontFamily: 'RobotoCondensed-Regular',
    fontSize: 20,
  },
});

export default UpperBar;
