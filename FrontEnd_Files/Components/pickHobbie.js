/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-paper';
const pickHobbie = props => {
  const [pressed, setPressed] = useState(false);

  return (
    <Card
      style={{
        width: '90%',
        height: 150,
        margin: 10,
      }}>
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <Pressable
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginLeft: 10,
          }}
          onPress={() => setPressed(!pressed)}>
          <Ionicons
            name={pressed ? 'heart' : 'heart-outline'}
            color={pressed ? 'red' : 'gray'}
            size={22}
          />
        </Pressable>
        <Text
          style={{
            width: 100,
            fontWeight: 'bold',
            fontSize: 14,
            marginLeft: 10,
          }}>
          Category
        </Text>
      </View>

      <Card.Content
        style={{height: 60, marginTop: 20, width: '95%', alignSelf: 'center'}}
        // source={require('../assets/Images/Hangout.jpg')}
      />
      <Card.Content
        style={{
          justifyContent: 'flex-end',
        }}>
        <Text>Card Description</Text>
      </Card.Content>
    </Card>
  );
};

export default pickHobbie;
