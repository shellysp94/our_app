/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {View, Modal, Pressable, Text, Button} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../Styles/FiltersStyle';
const FilterItem = props => {
  const arr = props.arr.slice(1);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.viewStyle}>
      <Modal transparent={true} visible={visible}>
        <View style={styles.Item}>
          <View style={{marginTop: 50}}>
            {arr.map(item => {
              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    props.function(item);
                    hideModal();
                  }}>
                  <Text style={styles.textItem}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.buttonContainer}>
            <Button title={'close'} onPress={hideModal} />
          </View>
        </View>
      </Modal>

      <View style={{flexDirection: 'row'}}>
        <View>
          <Pressable style={styles.itemPressable} onPress={showModal}>
            <Text style={styles.valueItemText}>{props.title}</Text>
          </Pressable>
        </View>
        <View style={{justifyContent: 'center'}}>
          <Pressable onPress={() => props.function(props.arr[0])}>
            <Ionicons color={'#1B8AA0'} size={18} name={'trash-outline'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FilterItem;
