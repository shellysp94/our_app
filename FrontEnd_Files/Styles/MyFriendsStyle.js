import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  textInput: {
    textInput: {
      padding: 4,
      width: 220,
      backgroundColor: '#ffffff',
      fontSize: 16,
      fontFamily: Theme.fontFamilyRegular,
      borderWidth: 1,
      borderRadius: 5,
    },
  },
  Pressable: {
    searchButton: {
      width: 70,
      borderRadius: 5,
      backgroundColor: Theme.highLightColor,
      justifyContent: 'center',
      borderColor: '#FFFFFF',
      borderWidth: 1,
    },
    trashPressable: {
      justifyContent: 'center',
    },
    requestPressable: {
      width: 180,
      backgroundColor: Theme.highLightColor,
      elevation: 10,
      borderRadius: 5,
      justifyContent: 'center',
      borderColor: '#FFFFFF',
      borderWidth: 1,
      height: 30,
    },
  },
  View: {
    container: {
      backgroundColor: Theme.backgroundColor,
      height: Theme.height,
      width: Theme.width,
    },
    pressableContaner: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
      left: 10,
      width: '95%',
    },
    searchFriend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      left: 5,
      width: '98%',
    },
  },
  Icon: {
    trashIcon: {
      backgroundColor: 'white',
      elevation: 10,
      padding: 7,
      width: 35,
      height: 35,
      borderRadius: 5,
      color: Theme.backgroundColor,
    },
  },
  Text: {
    searchText: {
      alignSelf: 'center',
      color: Theme.backgroundColor,
      fontFamily: Theme.fontFamilyRegular,
      fontSize: 18,
    },
    requestText: {
      alignSelf: 'center',
      color: Theme.backgroundColor,
      fontFamily: Theme.fontFamilyRegular,
      fontSize: 16,
    },
  },
  SafeAreaView: {
    listOfConfContainer: {
      top: 20,
    },
  },
  // scroll: {
  //   height: 200,
  //   padding: 7,
  // },
});

export default styles;
