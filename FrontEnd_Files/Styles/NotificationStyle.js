import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  container: {
    height: Theme.height,
    width: Theme.width,
    backgroundColor: Theme.backgroundColor,
  },
  clearAllBtn: {
    width: 130,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#105A87',
    borderColor: 'white',
    borderWidth: 1,
    elevation: 10,
    flexDirection: 'row',
    borderRadius: 10,
  },
  itemsContainer: {
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#B0D0D9',
    width: '90%',
    marginTop: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    elevation: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderColor: '#fff',
    borderWidth: 1.5,
  },
  Pressables: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 30,
    width: 70,
    flexDirection: 'row',
  },
  Picture: {
    width: 40,
    height: 40,
  },
  Details: {
    paddingRight: 120,
    right: 10,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    color: '#2B7CAD',
  },
  body: {
    fontSize: 16,
    alignItems: 'flex-start',
    color: '#105A87',
    fontWeight: 'bold',
  },
  textClearBtn: {
    color: 'white',
    fontSize: 18,
  },
  iconItem: {
    backgroundColor: '#65B0C6',
    borderRadius: 18,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
  },
});

export default styles;
