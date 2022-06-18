import React from 'react';
import {useState} from 'react';
import {View, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from '../../Styles/ChatStyle';
import {TextInput} from 'react-native-paper';

const MessageForm = () => {
  const [value, setValue] = useState('');

  const HandleSubmit = event => {
    setValue('');
  };
  const HandleChange = event => {
    setValue(event.target.value);
  };

  return (
    <View>
      <TextInput
        style={styles.messageInput}
        placeholder="Send a message ..."
        value={value}
        onChange={HandleChange}
      />
      <Button title="submit" onPress={HandleSubmit} color="#841584" />
    </View>
  );
};

export default MessageForm;
