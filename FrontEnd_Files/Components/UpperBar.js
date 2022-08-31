/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Theme from '../Styles/Theme';
const UpperBar = props => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        //position: 'absolute',
        width: '100%',
        // height: 80,
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
      <View style={styles.titleContainer}>
        <Text style={styles.text}>{props.title}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  titleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    width: '100%',
    height: 30,
    margin: 10,
  },
  text: {
    left: 40,
    color: 'white',
    fontFamily: Theme.fontFamilyRegular,
    fontSize: 20,
    position: 'absolute',
  },
});

export default UpperBar;
