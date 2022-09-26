import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  container: {
    borderColor: '#0E6070',
    alignItems: 'center',
    padding: 20,
    elevation: 10,
    backgroundColor: '#FFFFFF',
    height: '50%',
    width: '90%',
    marginTop: '30%',
    alignSelf: 'center',
  },
  scroll: {
    width: '100%',
    height: '100%',
    marginBottom: 5,
  },

  title: {
    color: '#0E6070',
    fontSize: 24,
    alignSelf: 'center',
    fontFamily: Theme.fontFamilyBold,
  },
});
export default styles;
