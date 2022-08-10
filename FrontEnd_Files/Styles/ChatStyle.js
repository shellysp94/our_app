import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  View: {
    row: {
      flexDirection: 'row',
    },
    Details: {
      width: 220,
      justifyContent: 'flex-start',
    },
    manageChatsContainer: {
      backgroundColor: Theme.backgroundColor,
      height: Theme.height,
      width: Theme.width,
    },
    container: {
      flex: 1,
    },
    chatFeed: {
      height: '90%',
      width: Theme.width,
      overflow: 'scroll',
      top: 30,
    },
    theirMessage: {
      backgroundColor: Theme.highLightColor,
      margin: 2,
      padding: 12,
      fontSize: 16,
      borderRadius: 6,
      maxWidth: '70%',
      marginLeft: 18,
      alignSelf: 'flex-start',
      // flexDirection: 'row',
    },
    myMessage: {
      backgroundColor: Theme.backgroundColor,
      margin: 2,
      padding: 12,
      fontSize: 16,
      borderRadius: 6,
      maxWidth: '70%',
      marginRight: 18,
      alignSelf: 'flex-end',
    },
    messageFormContainer: {
      width: '100%',
      marginBottom: 40,
      paddingHorizontal: 10,
    },
    chatDetailsContainer: {
      top: 10,
      left: 10,
      padding: 7,
      flexDirection: 'row',
      width: '95%',
    },
  },
  Pressable: {
    item: {
      backgroundColor: '#FFFFFF',
      width: '90%',
      marginTop: 5,
      alignSelf: 'center',
      flexDirection: 'row',
      padding: 10,
      elevation: 10,
      marginBottom: 5,
      borderRadius: 5,
      borderWidth: 1.5,
    },
    Pressables: {
      alignItems: 'center',
      width: 70,
      flexDirection: 'row',
    },
  },
  Image: {
    userPic: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
  },

  Text: {
    title: {
      fontSize: 22,
      alignItems: 'flex-start',
      color: Theme.backgroundColor,
      fontFamily: Theme.fontFamilyBold,
    },
    body: {
      fontSize: 18,
      color: '#105A87',
      fontFamily: Theme.fontFamilyRegular,
    },
    chatTitle: {
      textAlign: 'center',
      color: '#334c9e',
      fontWeight: 'bold',
      fontSize: 24,
    },
    chatSubtitle: {
      textAlign: 'center',
      color: '#7554a0',
      fontSize: 12,
    },

    MessageTitle: {
      fontFamily: Theme.fontFamilyBold,
      color: Theme.backgroundColor,
    },
    MessageBody: {
      fontFamily: Theme.fontFamilyRegular,
      color: Theme.backgroundColor,
    },
    myMessageTime: {
      color: '#FFFFFF',
      marginLeft: 15,
      fontSize: 12,

      fontFamily: Theme.fontFamilyRegular,
    },
    theirMessageTime: {
      fontSize: 12,
      fontFamily: Theme.fontFamilyRegular,
    },
  },
  TInput: {
    messageInput: {
      height: 50,
      backgroundColor: 'white',
      fontSize: 15,
      bottom: 0,
    },
  },
  // messageForm: {
  //   width: '95%',
  //   borderRadius: 6,
  //   position: 'absolute',
  // },

  // dateContainer: {
  //   justifyContent: 'center',
  //   position: 'absolute',
  //   right: -20,
  //   alignSelf: 'center',
  // },
});

export default styles;