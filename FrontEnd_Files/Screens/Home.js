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

const Home = () => {
  const [expanded, setExpanded] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [visible, setVisible] = useState(false);

  const userConfig = useSelector(state => state.configuration.userConfig);
  const fullName = useSelector(state => state.configuration.fullName);
  const searchMode = useSelector(state => state.configuration.searchMode);
  const searchModeOptions = useSelector(
    state => state.general.rawText.filters.Search_Mode,
  );

  const getPhotos = async () => {
    try {
      const userPhotos = await axios.get(
        `http://192.168.1.141:3000/userPictures/main/${userConfig.user_id}`,
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

  const items = searchModeOptions.map((item, index) => {
    return (
      <List.Item
        style={styles.searchModeItems}
        title={item}
        key={index}
        onPress={() => changeMode(item)}
      />
    );
  });

  useEffect(() => {
    setVisible(false);
    getPhotos();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <UplaodImageModal visible={visible} setVisible={setVisible} />
      </View>
      <UpperBar title={'Home'} />
      <View style={styles.innterContainer}>
        <Text style={styles.text}>Welcome {fullName}!</Text>
        <View>
          <Pressable style={styles.pressPic}>
            <Image
              style={styles.myPic}
              source={{uri: `data:image/gif;base64,${userConfig.image}`}}
            />
          </Pressable>
        </View>
        <SafeAreaView style={styles.searchModeList}>
          <List.Accordion
            title={searchMode}
            style={styles.selectedSearchMode}
            expanded={expanded}
            onPress={() => setExpanded(!expanded)}>
            {items}
          </List.Accordion>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default Home;
