import React from 'react';
import {View, Text} from 'react-native';
import styles from '../../Styles/ChatStyle';

const MyMessage = (props) => {
	return (
		<View style={styles.myMessage}>
			<Text style={{fontWeight: 'bold'}}>user1</Text>
			<Text>{props.message}</Text>
		</View>
	);
};

export default MyMessage;
