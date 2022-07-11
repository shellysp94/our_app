import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  container: {
    height: Theme.height,
    width: Theme.width,
    backgroundColor: Theme.backgroundColor,
  },

  menuPic: {
    marginLeft: 15,
    marginTop: 50,
    height: 22,
    width: 22,
  },
  innterContainer: {
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 30,
    top: 20,
  },
  myPic: {
    height: 170,
    width: 170,
    alignSelf: 'center',
    zIndex: 1,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    elevation: 10,
    borderRadius: 85,
  },
  pressPic: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 220,
    width: 220,
    top: 30,
  },
  searchModeList: {
    marginTop: 20,
    backgroundColor: 'white',
    elevation: 10,
    width: '70%',
  },
  selectedSearchMode: {
    height: 40,
    padding: 2,
  },
  searchModeItems: {
    padding: 2,
  },
  lottiStyle: {
    alignSelf: 'center',
    zIndex: 0,
    height: 250,
    width: 250,
  },
});
export default styles;
