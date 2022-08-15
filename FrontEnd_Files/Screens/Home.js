/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, SafeAreaView, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {List} from 'react-native-paper';
import UplaodImageModal from '../Components/uploadImageModal';
import styles from '../Styles/HomeStyle';
import axios from 'axios';
import UpperBar from '../Components/UpperBar';
import {updateSearchMode} from '../store/Slices/configurationSlice';
import {ScrollView} from 'react-native-gesture-handler';
import Theme from '../Styles/Theme';

const Home = () => {
  const [expanded, setExpanded] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [visible, setVisible] = useState(false);

  const myLatitude = useSelector(state => state.general.myLatitude);
  const myLongitude = useSelector(state => state.general.myLongitude);
  const userConfig = useSelector(state => state.configuration.userConfig);
  const fullName = useSelector(state => state.configuration.fullName);
  const searchMode = useSelector(state => state.configuration.searchMode);
  const searchModeOptions = useSelector(
    state => state.general.rawText.filters.Search_Mode,
  );

  const getPhotos = async () => {
    try {
      const userPhotos = await axios.get(
        `http://172.20.10.4:3000/userPictures/main/${userConfig.user_id}`,
      );
      setPhotos(userPhotos.data);
      if (userPhotos.data.length === 0) {
        setVisible(true); //BUG async commands
      }
    } catch (error) {
      alert(error);
    }
  };
  const dispatch = useDispatch();
  const changeMode = item => {
    setExpanded(!expanded);
    dispatch(
      updateSearchMode({
        searchMode: item,
      }),
    );
  };
  const getIcon = item => {
    if (item === 'Food') return require('../assets/icons/hamburger.png');
    if (item === 'Coffee') return require('../assets/icons/coffee-cup.png');
    if (item === 'Training') return require('../assets/icons/sports.png');
    if (item === 'Beer') return require('../assets/icons/toast.png');
    if (item === 'Whatever') return require('../assets/icons/all.png');
    if (item === 'Study') return require('../assets/icons/education.png');
    if (item === 'Shopping') return require('../assets/icons/shopping.png');
  };
  const items = searchModeOptions.map((item, index) => {
    return (
      <List.Item
        style={styles.List.searchModeItems}
        titleStyle={{fontFamily: Theme.fontFamilyRegular}}
        title={item}
        key={index}
        left={props => (
          <Image
            style={{left: 5, height: 20, width: 20, alignSelf: 'center'}}
            source={getIcon(item)}
          />
        )}
        onPress={() => changeMode(item)}
      />
    );
  });

  useEffect(() => {
    setVisible(false);
    getPhotos();
  }, []);

  return (
    <View style={styles.View.container}>
      <UplaodImageModal visible={visible} setVisible={setVisible} />
      <UpperBar title={'Home'} />
      <View style={styles.View.innterContainer}>
        <Text style={styles.Text.text}>Welcome </Text>
        <Text style={styles.Text.text}>{fullName}!</Text>
        <View>
          <Pressable style={styles.Pressable.pressPic}>
            <Image
              style={styles.Image.myPic}
              source={{uri: `data:image/gif;base64,${userConfig.image}`}}
            />
          </Pressable>
        </View>
        <ScrollView style={styles.ScrollView.searchModeList}>
          <List.Accordion
            title={searchMode}
            titleStyle={{fontFamily: Theme.fontFamilyRegular}}
            style={styles.List.selectedSearchMode}
            expanded={expanded}
            onPress={() => setExpanded(!expanded)}
            left={props => (
              <Image
                style={{left: 5, height: 20, width: 20, alignSelf: 'center'}}
                source={getIcon(searchMode)}
              />
            )}>
            {items}
          </List.Accordion>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;
