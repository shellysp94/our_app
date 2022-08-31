import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    alignSelf: 'center',
    top: 50,
    marginBottom: 60,
  },
  fullNameText: {
    alignSelf: 'center',
    fontFamily: Theme.fontFamilyBold,
    color: '#000000',
  },
  emailText: {
    alignSelf: 'center',
    color: '#000000',
    fontFamily: Theme.fontFamilyRegular,
  },
  detailsText: {
    alignSelf: 'center',
    color: '#000000',
    fontFamily: Theme.fontFamilyRegular,
  },
  detailsContainer: {
    marginTop: 10,
  },
});
export default styles;
