import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  SafeAreaView: {
    container: {
      flex: 1,
      justifyContent: 'center',
    },
  },
  View: {
    headerBlock: {
      alignItems: 'center',
      top: 20,
    },
    filtersMenu: {
      top: 30,
      alignSelf: 'center',
      width: '90%',
      height: '80%',
    },
    freindsOnlyBlock: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'center',
      top: 10,
      left: 20,
    },
    OnlineOnlyBlock: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'center',
      top: 10,
      left: 20,
    },
    applyBlock: {
      top: 20,
      width: 100,
      alignSelf: 'center',
    },
  },
  Text: {
    findNewFriendsText: {
      color: '#000000',
      fontSize: 18,
      fontFamily: Theme.fontFamilyBold,
    },
    friendsOnlyText: {
      alignSelf: 'center',
      justifyContent: 'center',
      fontFamily: Theme.fontFamilyRegular,
      color: '#000000',
    },
    applyText: {
      color: '#FFFFFF',
      justifyContent: 'center',
      alignSelf: 'center',
      fontSize: 16,
      fontFamily: Theme.fontFamilyRegular,
    },
    clearText: {
      color: '#000000',
      justifyContent: 'center',
      alignSelf: 'center',
      fontSize: 16,
      left: 35,
      fontFamily: Theme.fontFamilyRegular,
    },
  },
  Icon: {
    searchIcon: {
      left: 10,
      position: 'absolute',
      justifyContent: 'center',
    },
    clearIcon: {
      alignSelf: 'center',
      left: 10,
    },
  },
  Pressable: {
    searchPressable: {
      backgroundColor: Theme.secondColor,
      // borderWidth: 1,
      // borderColor: Theme.backgroundColor,
      justifyContent: 'center',
      alignSelf: 'center',
      width: 150,
      elevation: 5,
      borderRadius: 5,
      height: 50,
    },
    trashPressables: {
      backgroundColor: '#ffff',
      alignSelf: 'center',
      width: 150,
      marginTop: 10,
      elevation: 5,
      borderRadius: 5,
      height: 40,
      flexDirection: 'row',
    },
  },
  FilterItem: {
    viewStyle: {
      backgroundColor: Theme.highLightColor,
      padding: 7,
      margin: 5,
      alignSelf: 'center',
      borderRadius: 5,
      width: '75%',
      borderWidth: 1,
      borderColor: Theme.highLightColor,
      elevation: 5,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    itemPressable: {
      justifyContent: 'center',
      width: 160,
    },
    valueItemText: {
      fontSize: 16,
      color: '#000000',
      fontFamily: Theme.fontFamilyRegular,
    },
  },
  Modal: {
    Item: {
      padding: 20,
      elevation: 10,
      backgroundColor: '#ffff',
      height: '80%',
      width: '80%',
      marginTop: 80,
      marginLeft: 40,
      flexDirection: 'column',
    },
    title: {
      alignSelf: 'center',
      fontSize: 22,
      color: Theme.secondColor,
      fontFamily: Theme.fontFamilyBold,
      marginBottom: 40,
      marginTop: 30,
    },
    sliderValues: {
      alignSelf: 'center',
      fontSize: 18,
      marginBottom: 80,
      fontFamily: Theme.fontFamilyBold,
      color: Theme.highLightColor,
    },
    buttonContainer: {
      top: 50,
      width: 250,
      alignSelf: 'center',
    },
    textItem: {
      color: '#1B8AA0',
      backgroundColor: '#ffff',
      elevation: 5,
      margin: 10,
      fontSize: 22,
      alignSelf: 'center',
    },
    hobbiesCatagoryTitleList: {
      fontWeight: 'bold',
      marginTop: 10,
    },
    radiusSliderContainer: {
      flex: 1,
      alignItems: 'center',
    },
    searchModeList: {
      alignSelf: 'center',
      backgroundColor: 'white',
      width: '90%',
    },
  },
});
export default styles;
