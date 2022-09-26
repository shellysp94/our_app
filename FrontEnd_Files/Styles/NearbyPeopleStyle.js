import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  View: {
    container: {
      height: Theme.height,
      width: Theme.width,
      backgroundColor: Theme.backgroundColor,
    },
    openFiltersContainer: {
      height: 50,
      width: 150,
      justifyContent: 'center',
      alignSelf: 'center',
    },
  },
  Pressable: {
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
  },
  ScrollView: {
    scroll: {
      top: 10,
      height: 500,
      padding: 7,
    },
  },
  Text: {
    openFiltersText: {
      fontFamily: Theme.fontFamilyRegular,
      fontSize: 16,
      left: 5,
    },
  },
});

export default styles;
