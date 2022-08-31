import {StyleSheet, Dimensions} from 'react-native';
import Theme from './Theme';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  View: {
    container: {
      height: Theme.height,
      width: Theme.width,
      backgroundColor: Theme.backgroundColor,
    },
    innterContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'white',
    },
    hobTextContainer: {
      width: 350,
    },
    upArrowContainer: {
      alignSelf: 'flex-end',
      justifyContent: 'flex-end',
      height: '100%',
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
      fontWeight: 'bold',
      fontSize: 28,
    },
   
    peopleInTheArea: {
      fontWeight: 'bold',
      color: '#FFFFFF',
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
    height: height - 24,

    // justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    top: 20,
    fontFamily: Theme.fontFamilyRegular,
  },
});
export default styles;
