import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.backgroundColor,
    height: Theme.height,
    width: Theme.width,
  },
  searchFriend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    left: 5,
    width: '98%',
  },
  textInput: {
    padding: 4,
    width: 220,
    backgroundColor: '#fff',
    borderColor: 'darkgray',
    borderWidth: 1,
    borderRadius: 5,
  },
  searchButton: {
    width: 70,
    borderRadius: 5,
    backgroundColor: '#005252',
    justifyContent: 'center',
  },
  searchText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#ffffff',
  },

  scroll: {
    height: 200,
    padding: 7,
  },
  trashPressable: {
    justifyContent: 'center',
  },
  trashIcon: {
    backgroundColor: 'white',
    elevation: 10,
    padding: 7,
    width: 35,
    height: 35,
    borderRadius: 5,
  },
  pressableContaner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    left: 10,
    width: '95%',
  },
  requestPressable: {
    width: 150,
    backgroundColor: '#007c7c',
    elevation: 10,
    borderRadius: 5,
    justifyContent: 'center',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    height: 30,
  },
  requestText: {
    alignSelf: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listOfConfContainer: {
    top: 20,
  },
});

export default styles;
