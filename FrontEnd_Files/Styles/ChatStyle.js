import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  manageChatsContainer: {
    backgroundColor: Theme.backgroundColor,
    height: '100%',
  },
  chatFeed: {
    height: '100%',
    width: '100%',
    overflow: 'scroll',
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
    position: 'absolute',
    bottom: 0,
    paddingBottom: 30,
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
    backgroundColor: '#CDEAE2',
    margin: 2,
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
    // color: 'white',
    alignSelf: 'flex-end',
    backgroundColor: Theme.backgroundColor,
  },

  messageInput: {
    height: 50,
    backgroundColor: 'white',
    fontSize: 15,
    bottom: 0,
  },

  item: {
    backgroundColor: '#B0D0D9',
    width: '90%',
    marginTop: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    padding: 10,
    elevation: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderColor: '#fff',
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
    color: '#2B7CAD',
  },
  body: {
    fontSize: 18,
    alignItems: 'flex-start',
    color: '#105A87',
    fontWeight: 'bold',
  },
  dateContainer: {
    justifyContent: 'center',
    position: 'absolute',
    right: -20,
    alignSelf: 'center',
  },
});

export default styles;
