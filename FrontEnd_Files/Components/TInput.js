/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import {TextInput} from 'react-native';
import {View} from 'react-native';
import Theme from '../Styles/Theme';

const TInput = props => {
  return (
    <View>
      <TextInput
        style={{
          ...props.style,
          fontSize: 18,
          backgroundColor: '#FFFFFF',
          borderRadius: 5,
          color: Theme.backgroundColor,
          fontFamily: Theme.fontFamilyRegular,
        }}
        value={props.value}
        editable={props.editable}
        placeholder={props.title}
        secureTextEntry={props.secureTextEntry}
        outlineColor={'#13869D'}
        underlineColor="#13869D"
        label={props.name}
        dense={true}
        onChangeText={props.onChangeText}
      />
    </View>
  );
};

export default TInput;
