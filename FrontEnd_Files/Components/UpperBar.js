import React from 'react';
import {View, Text, Pressable} from 'react-native';
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
      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'flex-start',
          position: 'absolute',
          width: '100%',
          height: 30,
        }}>
        <Text
          style={{
            left: 40,
            color: 'white',
            fontSize: 20,
          }}>
          {props.title}
        </Text>
      </View>
    </View>
  );
};

export default UpperBar;
