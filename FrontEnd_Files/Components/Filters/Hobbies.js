/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import signUpHobbies from '../../Styles/SignUpHobbies';
import FiltersHobbies from '../../Styles/FiltersHobbies';
import {updateHobbies} from '../../store/Slices/configurationSlice';
const Hobbies = props => {
  const listOfHobbies = useSelector(state => state.general.rawText.Hobbies);
  const myHobbies = useSelector(state => state.configuration.myHobbies);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const dispatch = useDispatch();
  const hobbiesStyle =
    props.styling === 'SignUp' ? {...signUpHobbies} : {...FiltersHobbies};
  const hobbiesListItemStyle = item => {
    return {
      backgroundColor: myHobbies.includes(item) ? '#48D1CC' : 'transparent',
      borderRadius: 3,
      padding: 2,
    };
  };

  const addToList = val => {
    dispatch(
      updateHobbies({
        myHobbies: [...myHobbies, val],
      }),
    );
  };
  const clearHobbies = () => {
    dispatch(
      updateHobbies({
        myHobbies: [],
      }),
    );
  };

  console.log(JSON.stringify(hobbiesStyle, null, 2));
  return (
    <View style={hobbiesStyle.viewStyle}>
      <Modal transparent={true} visible={visible}>
        <View style={hobbiesStyle.Item}>
          <View style={{top: 20, alignSelf: 'center', position: 'absolute'}}>
            <Text style={{fontSize: 18}}>Hobbies</Text>
          </View>
          <ScrollView>
            {[...listOfHobbies].slice(1).map((element, elmIndx) => {
              return (
                <View key={elmIndx}>
                  <Text style={hobbiesStyle.hobbiesCatagoryTitleList}>
                    {element.type}
                  </Text>

                  {element.lst.map((item, index) => {
                    return (
                      <TouchableOpacity
                        //FIX ME reRender on press
                        style={hobbiesListItemStyle(item)}
                        key={index}
                        onPress={() => addToList(item)}>
                        <Text>{item}</Text>
                      </TouchableOpacity>
                    );
                  })}
                  <Divider style={{marginTop: 7}} />
                </View>
              );
            })}
          </ScrollView>
          <View style={{alignSelf: 'center'}}>
            <Button color={'#2C143E'} title={'close'} onPress={hideModal} />
          </View>
        </View>
      </Modal>

      {/* filter item */}
      <View style={{flexDirection: 'row'}}>
        <View>
          <Pressable style={hobbiesStyle.itemPressable} onPress={showModal}>
            <Text style={hobbiesStyle.valueItemText}>{props.text}</Text>
          </Pressable>
        </View>
        <View style={{justifyContent: 'center'}}>
          <Pressable onPress={() => clearHobbies()}>
            <Ionicons color={'#1B8AA0'} size={18} name={'trash-outline'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Hobbies;
