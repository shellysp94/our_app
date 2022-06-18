// eslint-disable-next-line no-unused-vars
import React from 'react';
import {SafeAreaView, View, Text, Pressable} from 'react-native';
import {DrawerItemList} from '@react-navigation/drawer';
import styles from '../Styles/MenuStyle';
import {useSelector} from 'react-redux';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const CustomSidebarMenu = props => {
  const navigation = useNavigation();
  const state = useSelector(state => state);
  const userConfig = state.userConfig;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        {Object.keys(userConfig).length !== 0 && (
          <View>
            <Pressable onPress={() => navigation.navigate('My Profile')}>
              <Avatar.Image
                size={110}
                source={{uri: `data:image/gif;base64,${userConfig.image}`}}
              />
            </Pressable>
            <Text style={styles.fullNameText}>{state.fullName}</Text>
            <Text style={styles.emailText}>{state.email}</Text>
          </View>
        )}
        {Object.keys(userConfig).length === 0 && (
          <View>
            <Text>please log in</Text>
          </View>
        )}
      </View>
      <DrawerItemList {...props} />
    </SafeAreaView>
  );
};

export default CustomSidebarMenu;
