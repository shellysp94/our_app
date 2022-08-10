import {StyleSheet} from 'react-native';
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
    fontWeight: 'bold',
  },
  emailText: {
    alignSelf: 'center',
  },
});
export default styles;
