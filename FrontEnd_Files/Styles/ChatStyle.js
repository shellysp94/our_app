import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  manageChatsContainer: {
    backgroundColor: '#61AF9B',
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
    position: 'absolute',
    width: '100%',
    padding: 18,
    bottom: 60,
    top: 500,
    height: 50,
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
    marginLeft: 4,
  },
  myMessage: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    maxWidth: '60%',
    alignItems: 'flex-end',
    marginRight: 18,
    color: 'white',
    backgroundColor: '#75bedF',
    alignSelf: 'flex-end',
  },

  messageInput: {
    height: 40,
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    fontSize: 15,
  },
  sendIcon: {
    position: 'relative',
  },
  messageBlock: {
    width: '100%',
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
});

export default styles;
