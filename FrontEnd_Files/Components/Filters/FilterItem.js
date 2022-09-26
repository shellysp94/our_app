/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import {View, Modal, Pressable, Text, Button} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../Styles/FiltersStyle';
import Theme from '../../Styles/Theme';
import {updateOneFilter} from '../../store/Slices/configurationSlice';
import {useDispatch} from 'react-redux';
const FilterItem = props => {
  const title = props.title;
  const filter = props.filter;
  const arr = props.arr.slice(1);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const dispatch = useDispatch();
  return (
    <View style={styles.FilterItem.viewStyle}>
      {/*Modal */}
      <Modal transparent={true} visible={visible}>
        <View style={styles.Modal.Item}>
          <View style={{marginTop: 50}}>
            {arr.map(item => {
              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    dispatch(updateOneFilter({filter: filter, item: item}));
                    hideModal();
                  }}>
                  <Text style={styles.Modal.textItem}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.Modal.buttonContainer}>
            <Button
              color={Theme.highLightColor}
              title={'close'}
              onPress={hideModal}
            />
          </View>
        </View>
      </Modal>

      {/* Item in filters menu */}
      <View style={{flexDirection: 'row'}}>
        <View>
          <Pressable
            style={styles.FilterItem.itemPressable}
            onPress={showModal}>
            <Text style={styles.FilterItem.valueItemText}>{title}</Text>
          </Pressable>
        </View>
        <View style={{justifyContent: 'flex-start'}}>
          <Pressable
            onPress={() => {
              dispatch(updateOneFilter({filter: filter, item: props.arr[0]}));
            }}>
            <Ionicons
              color={Theme.backgroundColor}
              size={18}
              name={'trash-outline'}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default FilterItem;
