import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  manageChatsContainer: {
    backgroundColor: Theme.backgroundColor,
    height: '100%',
  },
  chatFeed: {
    height: '90%',
    width: '100%',
    overflow: 'scroll',
    top: 30,
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
  messageFormContainer: {
    width: '100%',
    bottom: 20,
    paddingHorizontal: 10,
  },
  messageForm: {
    width: '95%',
    borderRadius: 6,
    position: 'absolute',
  },
  thierMessage: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    maxWidth: '60%',
    backgroundColor: '#48D1CC',
    margin: 2,
    marginLeft: 18,
    alignSelf: 'flex-start',
  },
  myMessage: {
    margin: 2,
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    maxWidth: '60%',
    alignItems: 'flex-end',
    marginRight: 18,
    alignSelf: 'flex-end',
    backgroundColor: Theme.backgroundColor,
  },
  thierMessageContent: {
    fontWeight: 'bold',
  },
  messageInput: {
    height: 50,
    backgroundColor: 'white',
    fontSize: 15,
    bottom: 0,
  },

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
  container: {
    flex: 1,
  },
  Pressables: {
    alignItems: 'center',
    width: 70,
    flexDirection: 'row',
  },

  Details: {
    width: 220,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    color: '#2C143E',
  },
  body: {
    fontSize: 18,
    color: '#105A87',
  },
  dateContainer: {
    justifyContent: 'center',
    position: 'absolute',
    right: -20,
    alignSelf: 'center',
  },
});

export default styles;
