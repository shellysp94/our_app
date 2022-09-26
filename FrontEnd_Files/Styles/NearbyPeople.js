import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  container: {
    height: Theme.height,
    width: Theme.width,
    backgroundColor: Theme.backgroundColor,
  },

  filterIconSection: {
    backgroundColor: '#0E6070',
    height: 30,
    alignItems: 'center',
  },
  filterIcon: {
    height: 18,
    width: 18,
    margin: 7,
  },
  menuPic: {
    top: 20,
    height: 18,
    width: 18,
  },
  scroll: {
    top: 10,
    height: 500,
    padding: 7,
  },
  textInput: {
    top: 70,
    padding: 4,
    justifyContent: 'center',
    width: 320,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderColor: 'darkgray',
    borderWidth: 1,
    borderRadius: 5,
  },
  filtersStyle: {
    backgroundColor: 'white',
    width: 140,
    height: 40,
    flexDirection: 'row',
    padding: 7,
    borderRadius: 20,
    elevation: 10,
    alignSelf: 'center',
  },
  openFiltersContainer: {
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  openFiltersText: {
    fontWeight: 'bold',
    fontSize: 16,
    left: 10,
  },
});

export default styles;
