// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, SafeAreaView, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {List} from 'react-native-paper';
import UplaodImageModal from '../Components/uploadImageModal';
import styles from '../Styles/HomeStyle';
import axios from 'axios';
import UpperBar from '../Components/UpperBar';

const Home = () => {
  const [expanded, setExpanded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [photos, setPhotos] = useState([]);
  const url = 'http://192.168.1.141:3000/userPictures/main/';
  const userConfig = useSelector(state => state.userConfig);
  const [visible, setVisible] = useState(false);

  const fullName = useSelector(state => state.fullName);
  const searchMode = useSelector(state => state.searchMode);
  const raw = useSelector(state => state.rawText);
  const searchModeOptions = raw.filters.Search_Mode;

  const getPhotos = async () => {
    try {
      const userPhotos = await axios.get(`${url}${userConfig.user_id}`);
      setPhotos(userPhotos.data);
      if (userPhotos.data.length === 0) {
        setVisible(true); //BUG async commands
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error);
    }
  };
  const conf = useSelector(state => state.userConfig);
  const dispatch = useDispatch();
  const changeMode = item => {
    setExpanded(!expanded);
    dispatch({
      type: 'UPDATE_SEARCH_MODE',
      searchMode: item,
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              source={{uri: `data:image/gif;base64,${conf.image}`}}
            />
            {/* <LottieView
              ref={animation}
              style={styles.lottiStyle}
              source={require('../Images/Shazam1.json')}
            /> */}
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
