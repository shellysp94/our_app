/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react';
import {View, Modal, Pressable, Text, Button} from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../Styles/FiltersStyle';

const searchModeItems = props => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const modes = useSelector(state => state.rawText.filters.Search_Mode);
  const items = modes.map((item, index) => {
    return (
      <Pressable
        style={{marginTop: 20}}
        key={index}
        onPress={() => props.setSearchMode(item)}>
        <Text style={{...styles.textItem, margin: 0}}>{item}</Text>
      </Pressable>
    );
  });

  return (
    <View style={styles.viewStyle}>
      <Modal transparent={true} visible={visible}>
        <View style={styles.Item}>
          <View style={styles.searchModeList}>{items}</View>
          <View style={{marginTop: 70}}>
            <Button title={'close'} onPress={hideModal} />
          </View>
        </View>
      </Modal>
      <View style={styles.item}>
        <Pressable
          style={styles.itemPressable}
          title={'Mode'}
          onPress={showModal}>
          <Text style={styles.valueItemText}>{props.title}</Text>
        </Pressable>
        <Ionicons
          color={'#1B8AA0'}
          size={18}
          style={styles.trashIcon}
          name={'trash-outline'}
        />
      </View>
    </View>
  );
};

export default searchModeItems;
