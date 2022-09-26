import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  container: {
    height: Theme.height,
    width: Theme.width,
    backgroundColor: Theme.backgroundColor,
  },
  itemsContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  item: {
    width: '90%',
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    padding: 10,
    elevation: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderColor: '#fff',
    borderWidth: 1.5,
  },
  Pressables: {
    flexDirection: 'row',
  },
  Picture: {
    width: 40,
    height: 40,
  },
  Details: {
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    alignSelf: 'flex-start',
    color: Theme.secondColor,
    fontFamily: Theme.fontFamilyBold,
  },
  body: {
    alignSelf: 'flex-start',
    color: Theme.secondColor,
    fontFamily: Theme.fontFamily,
  },

  iconItem: {
    backgroundColor: '#65B0C6',
    borderRadius: 18,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
});

export default styles;
