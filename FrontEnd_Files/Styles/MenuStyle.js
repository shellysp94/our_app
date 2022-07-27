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
    marginBottom: 80,
  },
  fullNameText: {
    alignSelf: 'center',
    fontFamily: Theme.fontFamilyBold,
    color: Theme.backgroundColor,
  },
  emailText: {
    alignSelf: 'center',
    color: Theme.backgroundColor,
    fontFamily: Theme.fontFamilyRegular,
  },
});
export default styles;
