/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {View, Text, Modal, Button, Pressable} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import styles from '../../Styles/FiltersStyle';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../Styles/Theme';

const AgeItem = props => {
  const config = useSelector(state => state.configuration.userConfig);
  const [visible, setVisible] = useState(false);
  const [min, setMin] = useState(config.age - 5);
  const [max, setMax] = useState(config.age + 5);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.FilterItem.viewStyle}>
      <Modal transparent={true} visible={visible}>
        <View style={styles.Modal.Item}>
          <Text style={styles.Modal.title}>Age</Text>
          <Text style={styles.Modal.sliderValues}>{`${min}-${max}`}</Text>
          <MultiSlider
            sliderLength={290}
            isMarkersSeparated={true}
            min={18}
            max={100}
            values={[min, max]}
            onValuesChangeFinish={values => {
              setMax(values[1]);
              setMin(values[0]);
              props.setAge(values);
            }}
          />
          <View style={styles.Modal.buttonContainer}>
            <Button
              color={Theme.highLightColor}
              title={'close'}
              onPress={hideModal}
            />
          </View>
        </View>
      </Modal>

      {/* filter item */}
      <View style={styles.FilterItem.item}>
        <Pressable style={styles.FilterItem.itemPressable} onPress={showModal}>
          {/* FIX ME -  stateFilters.age_filter !== [] only after apply*/}
          <Text style={styles.FilterItem.valueItemText}>
            {min}-{max}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setMax(config.age + 5);
            setMin(config.age - 5);
            props.setAge([min, max]);
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

export default AgeItem;
