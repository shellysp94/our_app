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
import styles from '../../Styles/FiltersStyle';
import {shouldRasterizeIOS} from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';

const Hobbies = props => {
  const listOfHobbies = useSelector(state => state.rawText.Hobbies);
  const myHobbies = useSelector(state => state.myHobbies);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const dispatch = useDispatch();

  const hobbiesListItemStyle = item => {
    return {
      backgroundColor: myHobbies.includes(item) ? '#81BEC9' : 'transparent',
      borderRadius: 3,
      padding: 2,
    };
  };

  const addToList = val => {
    dispatch({
      type: 'UPDATE_MY_HOBBIES',
      myHobbies: [...myHobbies, val],
    });
  };
  return (
    <View style={styles.viewStyle}>
      <Modal transparent={true} visible={visible}>
        <View style={styles.Item}>
          <View style={{top: 20, alignSelf: 'center', position: 'absolute'}}>
            <Text style={{fontSize: 18}}>Hobbies</Text>
          </View>
          <ScrollView style={styles.scrollView}>
            {[...listOfHobbies].slice(1).map((element, elmIndx) => {
              return (
                <View key={elmIndx}>
                  <Text style={styles.hobbiesCatagoryTitleList}>
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
            <Button title={'close'} onPress={hideModal} />
          </View>
        </View>
      </Modal>

      {/* filter item */}
      <View style={styles.item}>
        <Pressable style={styles.center} onPress={showModal}>
          <Text style={styles.valueItemText}>{props.title}</Text>
        </Pressable>
        <Pressable style={styles.center}>
          <Ionicons
            color={'#1B8AA0'}
            size={18}
            style={styles.trashIcon}
            name={'trash-outline'}
          />
        </Pressable>
      </View>
    </View>
  );
};
// const styles = StyleSheet.create({
//   modal: {
//     padding: 20,
//     elevation: 10,
//     backgroundColor: '#ffff',
//     height: '80%',
//     width: '80%',
//     marginTop: 80,
//     marginLeft: 40,
//   },
//   scrollView: {
//     top: 20,
//     alignSelf: 'center',
//     height: 100,
//     width: '100%',
//     marginVertical: 30,
//   },
// });
export default Hobbies;
