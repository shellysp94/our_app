// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react';
import {View, Text, Modal, Button, Pressable} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import styles from '../../Styles/FiltersStyle';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Theme from '../../Styles/Theme';
import {updateOneFilter} from '../../store/Slices/configurationSlice';
import {useDispatch} from 'react-redux';

const AgeItem = props => {
  const config = useSelector(state => state.configuration.userConfig);
  const [visible, setVisible] = useState(false);
  // const filters = useSelector(state => state.configuration.filters);
  const age_filter = useSelector(
    state => state.configuration.filters.age_filter,
  );
  console.log('age_filter', age_filter);
  const dispatch = useDispatch();
  // const min = age_filter[0];
  // const max = age_filter[1];
  if (age_filter.length === 0) {
    console.log('!');
    dispatch(
      updateOneFilter({
        filter: 'age_filter',
        item: [config.age - 5, config.age + 5],
      }),
    );
  }
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.FilterItem.viewStyle}>
      {/*Modal */}
      <Modal transparent={true} visible={visible}>
        <View style={styles.Modal.Item}>
          <Text style={styles.Modal.title}>Age</Text>
          <Text
            style={
              styles.Modal.sliderValues
            }>{`${age_filter[0]}-${age_filter[1]}`}</Text>
          <MultiSlider
            sliderLength={290}
            isMarkersSeparated={true}
            min={18}
            max={100}
            values={[age_filter[0], age_filter[1]]}
            onValuesChangeFinish={values => {
              console.log(values);
              const max = values[1];
              const min = values[0];
              dispatch(
                updateOneFilter({
                  filter: 'age_filter',
                  item: [min, max],
                }),
              );
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

      {/* Item in filters menu */}
      <View style={styles.FilterItem.item}>
        <Pressable style={styles.FilterItem.itemPressable} onPress={showModal}>
          <Text style={styles.FilterItem.valueItemText}>
            {age_filter[0]}-{age_filter[1]}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            dispatch(
              updateOneFilter({
                filter: 'age_filter',
                item: [config.age - 5, config.age + 5],
              }),
            );
            // props.setAge([min, max]);
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
