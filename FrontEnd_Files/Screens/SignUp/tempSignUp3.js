/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-alert */
import React, {useState} from 'react';
import {View, Text, ScrollView, Button, Pressable, Image} from 'react-native';
import styles from '../../Styles/SignUpStyle';
import Theme from '../../Styles/Theme';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {updateDetails} from '../../store/Slices/configurationSlice';
import {updateConfiguration} from '../../store/Slices/configurationSlice';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheet, ListItem} from '@rneui/themed';
import {updateHobbies} from '../../store/Slices/configurationSlice';

const SignUp3 = ({route, navigation}) => {
  const {styling} = route.params;
  const dispatch = useDispatch();
  let tempList;

  const myHobbies = useSelector(state => state.configuration.myHobbies);
  const hobbies = useSelector(state => state.general.rawText.Hobbies);
  const signUpConfig = useSelector(state => state.configuration.signUpConfig);
  console.log(myHobbies);
  // const hobbiesStyle =
  //   styling === 'SignUp' ? {...signUpHobbies} : {...FiltersHobbies};
  const [isVisible, setIsVisible] = useState('');

  const getImages = item => {
    if (item === 'Sport')
      return require(`../../assets/Images/Hobbies/Hobbie-Sport.jpg`);
    if (item === 'Food')
      return require(`../../assets/Images/Hobbies/Hobbie-Food.jpg`);
    if (item === 'Music')
      return require(`../../assets/Images/Hobbies/Hobbie-Music.jpg`);
    if (item === 'Art')
      return require(`../../assets/Images/Hobbies/Hobbie-Art.jpg`);
    if (item === 'Intelligence')
      return require(`../../assets/Images/Hobbies/Hobbie-Intelligence.jpg`);
    if (item === 'Tech')
      return require(`../../assets/Images/Hobbies/Hobbie-Tech.jpg`);
    if (item === 'Outdoor')
      return require(`../../assets/Images/Hobbies/Hobbie-Outdoor.jpg`);
    if (item === 'Indoor')
      return require(`../../assets/Images/Hobbies/Hobbie-Indoor.jpg`);
  };

  let configuration = {
    myHobbies: [...myHobbies],
  };
  const updateState = () => {
    dispatch(updateConfiguration({signUpConfig: {...configuration}}));
  };
  const hobbiesListItemStyle = title => {
    if (title === 'Cancel') return {backgroundColor: 'red'};
    return {
      backgroundColor: myHobbies.includes(title) ? '#48D1CC' : '#FFFFFF',
    };
  };
  const AddUserToDB = async event => {
    try {
      const response = await axios.post(
        'http://192.168.1.141:3000/auth/register',
        signUpConfig,
      );
      if (response.data.hasOwnProperty('msg')) {
        alert(response.data.msg);
      } else {
        let loginDetails = {
          userConfig: response.data,
          email: response.data.email,
          fullName: `${response.data.first_name} ${response.data.last_name}`,
          token: response.data.token,
        };

        dispatch(updateDetails(loginDetails));
        navigation.navigate('Log In stack');
      }
    } catch (error) {
      alert(error);
    }
  };
  const addToList = val => {
    dispatch(
      updateHobbies({
        myHobbies: [...myHobbies, val],
      }),
    );
  };
  const getHobbiesList = (type, list) => {
    return (
      <SafeAreaProvider>
        <BottomSheet
          style={{flex: 1, justifyContent: 'flex-end'}}
          modalProps={{}}
          isVisible={isVisible === type}>
          {list.map((item, index) => (
            <ListItem
              key={index}
              containerStyle={hobbiesListItemStyle(item.title)}
              onPress={() => {
                if (item.title === 'Cancel') {
                  setIsVisible('');
                } else {
                  addToList(item.title);
                }
              }}>
              <ListItem.Content>
                <ListItem.Title style={item.titleStyle}>
                  {item.title}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
      </SafeAreaProvider>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up 🥳</Text>
      <ScrollView style={{height: '100%'}}>
        {hobbies.slice(1).map((item, index) => {
          return (
            <View key={index}>
              <Pressable
                onPress={() => setIsVisible(item.type)}
                style={{width: '100%', alignSelf: 'center', marginTop: 10}}
                key={index}>
                <Image
                  style={{
                    alignSelf: 'center',
                    borderRadius: 15,
                    width: 350,
                    height: 200,
                  }}
                  source={getImages(item.type)}
                />
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    left: 40,
                    bottom: 10,
                    alignSelf: 'baseline',
                    justifyContent: 'flex-end',
                    height: 200,
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      alignSelf: 'baseline',
                      fontSize: 22,
                    }}>
                    {item.type}
                  </Text>
                </View>
              </Pressable>
              {
                ((tempList = item.lst.map(item => {
                  return {title: item};
                })),
                (tempList = [
                  ...tempList,
                  {
                    title: 'Cancel',
                    // containerStyle: {backgroundColor: Theme.highLightColor},
                    // titleStyle: {alignSelf: 'center'},
                    onPress: () => setIsVisible(false),
                  },
                ]),
                getHobbiesList(item.type, tempList))
              }
            </View>
          );
        })}

        <View style={styles.ButtonSection1}>
          <Button
            color="#48D1CC"
            title="Continue"
            onPress={() => {
              updateState();
              AddUserToDB();
              navigation.navigate('SignUp4');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp3;
