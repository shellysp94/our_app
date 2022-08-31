/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {View, Text, Modal, Button, Pressable} from 'react-native';
import RnVerticalSlider from 'rn-vertical-slider';
import styles from '../../Styles/FiltersStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../Styles/Theme';

const Radius = props => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.FilterItem.viewStyle}>
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
                props.setRadius(value); //FIX ME
              }}
              onComplete={value => {
                console.log('COMPLETE', value);
              }}
              width={50}
              height={300}
              step={100}
            />

            <View style={{top: 50, width: 250, alignSelf: 'center'}}>
              <Button title={'close'} onPress={hideModal} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.FilterItem.item}>
        <Pressable
          style={styles.FilterItem.itemPressable}
          title={'Mode'}
          onPress={showModal}>
          <Text
            style={{
              fontFamily: Theme.fontFamilyRegular,
              color: '#000000',
              fontSize: 16,
            }}>
            {props.value} m
          </Text>
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
