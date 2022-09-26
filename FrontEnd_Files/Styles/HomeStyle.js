import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  View: {
    container: {
      height: Theme.height,
      width: Theme.width,
      backgroundColor: Theme.backgroundColor,
    },
    innterContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
  },
  Text: {
    text: {
      color: '#FFFFFF',
      fontSize: 30,
      top: 20,
      fontFamily: Theme.fontFamilyRegular,
    },
  },
  Pressable: {
    pressPic: {
      alignSelf: 'center',
      justifyContent: 'center',
      height: 220,
      width: 220,
      top: 30,
    },
  },
  Image: {
    myPic: {
      height: 170,
      width: 170,
      alignSelf: 'center',
      zIndex: 1,
      borderColor: '#FFFFFF',
      borderWidth: 3,
      borderRadius: 85,
    },
  },
  ScrollView: {
    searchModeList: {
      marginTop: 20,
      backgroundColor: 'white',
      elevation: 10,
      width: '70%',
    },
  },

  List: {
    selectedSearchMode: {
      height: 45,
      padding: 3,
    },
    searchModeItems: {
      padding: 2,
    },
  },
});
export default styles;
