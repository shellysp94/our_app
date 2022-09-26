import {StyleSheet, Dimensions} from 'react-native';
import Theme from './Theme';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  View: {
    container: {
      flex: 1,
      height: Theme.height,
      width: Theme.width,
      backgroundColor: Theme.backgroundColor,
    },
    innterContainer: {
      alignItems: 'center',
      backgroundColor: 'white',
    },
    hobTextContainer: {
      width: 350,
    },
    upArrowContainer: {
      alignSelf: 'flex-end',
      justifyContent: 'flex-end',
      zIndex: 1,
      position: 'absolute',
      bottom: 10,
      right: 10,
    },

    getTextContainer: {
      left: 50,
      height: '80%',
      zIndex: 1,
      position: 'absolute',
      justifyContent: 'flex-end',
    },
    bottomContainer: {
      flexDirection: 'row',
      width: 200,
    },
  },
  Text: {
    text: {
      color: '#FFFFFF',
      fontSize: 30,
      top: 20,
      fontFamily: Theme.fontFamilyRegular,
    },
    hobText: {
      color: '#FFFFFF',
      fontFamily: Theme.fontFamilyBold,
      fontSize: 28,
      width: '80%',
    },

    peopleInTheArea: {
      fontFamily: Theme.fontFamilyRegular,
      color: '#FFFFFF',
    },
  },
  Pressable: {
    checkItOut: {
      backgroundColor: Theme.secondColor,
      width: 80,
      height: 30,
      elevation: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      borderRadius: 5,
    },
  },

  ScrollView: {
    searchModeList: {
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

  child: {
    width: width,
    height: height,
    flex: 1,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    top: 20,
    fontFamily: Theme.fontFamilyRegular,
  },
});
export default styles;
