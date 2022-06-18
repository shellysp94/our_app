import React from 'react';
import styles from '../../Styles/ChatStyle';
import {useSelector} from 'react-redux';
import {View, Text} from 'react-native';

function TheirMessage(props) {
	const isTheirMsg = useSelector((state) => state.isMyMessage);
	return (
		<View style={{}}>
			<View style={styles.thierMessage}>
				<Text style={{fontWeight: 'bold'}}>user2</Text>
				<Text>{props.message}</Text>
			</View>
		</View>
	);
}

export default TheirMessage;
