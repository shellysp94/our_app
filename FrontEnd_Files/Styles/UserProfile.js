import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  container: {
    borderColor: '#0E6070',
    alignItems: 'center',
    padding: 20,
    elevation: 10,
    backgroundColor: '#ffff',
    height: '50%',
    width: '90%',
    marginTop: 80,
    alignSelf: 'center',
  },
  scroll: {
    width: '100%',
    height: '100%',
    marginBottom: 5,
  },
  Pic: {
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 40,
    height: 60,
    width: 60,
    marginRight: 15,
  },
  addPic: {
    //marginTop: 10,
    borderColor: '#0E6070',
    borderWidth: 1,
    borderRadius: 20,
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
  fullName: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  title: {
    color: '#0E6070',
    fontSize: 24,
    alignSelf: 'center',
    fontFamily: Theme.fontFamilyBold,
  },
});
export default styles;
