/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useState} from 'react';
import {View, Modal, Pressable, Text, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../../Styles/FiltersStyle';
import Theme from '../../Styles/Theme';
import {updateOneFilter} from '../../store/Slices/configurationSlice';

const searchModeItems = props => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const modes = useSelector(
    state => state.general?.rawText.filters.Search_Mode,
  );
  const dispatch = useDispatch();

  const items = modes.map((item, index) => {
    return (
      <Pressable
        style={styles.Pressable.modsPressables}
        key={index}
        onPress={() => {
          dispatch(updateOneFilter({filter: props.filter, item: item}));
          hideModal();
        }}>
        <Text style={{...styles.textItem, margin: 0}}>{item}</Text>
      </Pressable>
    );
  });

  return (
    <View style={styles.FilterItem.viewStyle}>
      {/* Modal */}
      <Modal transparent={true} visible={visible}>
        <View style={styles.Modal.Item}>
          <View style={styles.Modal.searchModeList}>{items}</View>
          <View style={{marginTop: 50}}>
            <Button title={'close'} onPress={hideModal} />
          </View>
        </View>
      </Modal>

      {/* Item in filters menu */}
      <View style={styles.FilterItem.item}>
        <Pressable
          style={styles.FilterItem.itemPressable}
          title={'Mode'}
          onPress={showModal}>
          <Text style={styles.FilterItem.valueItemText}>{props.title}</Text>
        </Pressable>
        <Pressable
          style={styles.FilterItem.center}
          onPress={() => {
            dispatch(
              updateOneFilter({
                filter: props.filter,
                item: props.arr[props.arr.length - 1],
              }),
            );
          }}>
          <Ionicons
            color={Theme.backgroundColor}
            size={18}
            style={styles.FilterItem.trashIcon}
            name={'trash-outline'}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default searchModeItems;
