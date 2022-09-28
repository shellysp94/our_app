import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  View: {
    titleContainer: {
      marginBottom: 10,
    },
    UpperBarContainer: {
      height: 50,
      position: 'absolute',
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
    friendImage: {
      flexDirection: 'row',
      alignSelf: 'center',
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
    messageFormInnerContainer: {
      marginTop: 10,
      flexDirection: 'row',
    },
    chatDetailsContainer: {
      left: 10,
      padding: 7,
      flexDirection: 'row',
      width: '95%',
    },
    row: {
      flexDirection: 'row',
    },
  },
  Pressables: {
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
    submitButton: {
      position: 'relative',
      margin: 8,
    },
    arrowBack: {
      alignSelf: 'center',
      marginRight: 10,
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
      alignSelf: 'center',
      fontSize: 22,
      color: Theme.secondColor,
      fontFamily: Theme.fontFamilyBold,
    },
    body: {
      fontSize: 18,
      color: '#105A87',
      fontFamily: Theme.fontFamilyRegular,
    },

    MessageBody: {
      fontFamily: Theme.fontFamilyRegular,
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
  Icon: {
    sentAndRecieveIcon: {
      alignSelf: 'center',
      marginRight: 4,
    },
  },
});

export default styles;
