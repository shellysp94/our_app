/* eslint-disable react-native/no-inline-styles */
// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {View, Text, Modal, Button, Pressable} from 'react-native';
import RnVerticalSlider from 'rn-vertical-slider';
import styles from '../../Styles/FiltersStyle';

const Radius = props => {
  const [visible, setVisible] = useState(false);
  const [radiusVal, setRadiusVal] = useState(1);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.viewStyle}>
      <Modal transparent={true} visible={visible}>
        <View style={styles.Item}>
          <Text style={{...styles.title, marginBottom: 20}}>Radius</Text>
          <View style={styles.radiusSliderContainer}>
            <RnVerticalSlider
              value={radiusVal}
              disabled={false}
              min={0}
              max={100}
              onChange={value => {
                props.setRadius(value); //FIX ME
              }}
              onComplete={value => {
                console.log('COMPLETE', value);
              }}
              width={50}
              height={300}
              step={1}
              borderRadius={5}
            />

            <View style={{top: 50, width: 250, alignSelf: 'center'}}>
              <Button title={'close'} onPress={hideModal} />
            </View>
          </View>
        </View>
      </Modal>
      <Pressable title={'Mode'} onPress={showModal}>
        <Text style={{color: '#FFFFFF', fontSize: 16}}>Radius</Text>
      </Pressable>
    </View>
  );
};

export default Radius;
