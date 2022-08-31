/* eslint-disable react-native/no-inline-styles */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {SafeAreaView, View, Text, Pressable} from 'react-native';
import {DrawerItemList} from '@react-navigation/drawer';
import styles from '../Styles/MenuStyle';
import {useSelector} from 'react-redux';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomSidebarMenu = props => {
  const navigation = useNavigation();
  const fullName = useSelector(state => state.configuration.fullName);
  const email = useSelector(state => state.configuration.email);
  const userConfig = useSelector(state => state.configuration.userConfig);
  const myStatus = useSelector(state => state.general?.myStatus);
  const mySearchMode = useSelector(
    state => state.configuration.filters?.search_mode_filter,
  );
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
            <Text style={styles.fullNameText}>{fullName}</Text>
            <Text style={styles.emailText}>{email}</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>{mySearchMode}</Text>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Ionicons
                  color={'#000000'}
                  size={15}
                  name={'chatbubble-ellipses-outline'}
                />
                <Text style={styles.detailsText}> {myStatus}</Text>
              </View>
            </View>
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
