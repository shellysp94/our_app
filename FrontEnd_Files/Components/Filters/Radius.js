/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {View, Text, Modal, Button, Pressable} from 'react-native';
import RnVerticalSlider from 'rn-vertical-slider';
import styles from '../../Styles/FiltersStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../Styles/Theme';
import {updateOneFilter} from '../../store/Slices/configurationSlice';
import {useDispatch} from 'react-redux';

const Radius = props => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const dispatch = useDispatch();
  return (
    <View style={styles.FilterItem.viewStyle}>
      {/*Modal */}
      <Modal transparent={true} visible={visible}>
        <View style={styles.Modal.Item}>
          <Text
            style={{
              ...styles.title,
              marginBottom: 20,
            }}>
            Radius: {props.value} m
          </Text>
          <View style={styles.Modal.radiusSliderContainer}>
            <RnVerticalSlider
              value={props.value}
              disabled={false}
              min={0}
              max={5000}
              onChange={value => {
                dispatch(
                  updateOneFilter({filter: 'radius_filter', item: value}),
                );
              }}
              width={50}
              height={300}
              step={100}
            />

            <View style={styles.View.closeModal}>
              <Button title={'close'} onPress={hideModal} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Item in filters menu */}
      <View style={styles.FilterItem.item}>
        <Pressable
          style={styles.FilterItem.itemPressable}
          title={'Mode'}
          onPress={showModal}>
          <Text style={styles.Text.itemText}>{props.value} m</Text>
        </Pressable>
        <Pressable style={styles.center}>
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

export default Radius;
