import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  trashPressables: {
    backgroundColor: '#ffff',
    alignSelf: 'center',
    width: 150,
    marginTop: 10,
    elevation: 5,
    borderRadius: 5,
    height: 40,
    flexDirection: 'row',
  },

  viewStyle: {
    backgroundColor: Theme.highLightColor,
    padding: 7,
    margin: 5,
    alignSelf: 'center',
    borderRadius: 5,
    width: '75%',
    elevation: 5,
  },
  itemPressable: {
    justifyContent: 'center',
    width: 160,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: 140,
  },
  valueItemText: {
    fontSize: 16,
    color: Theme.backgroundColor,
    fontFamily: Theme.fontFamilyRegular,
  },

  //////Modal
  Item: {
    padding: 20,
    elevation: 10,
    backgroundColor: '#ffff',
    height: '80%',
    width: '80%',
    marginTop: 80,
    marginLeft: 40,
    flexDirection: 'column',
  },
  title: {
    alignSelf: 'center',
    fontSize: 22,
    color: '#1B8AA0',
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 80,
  },
  sliderValues: {
    alignSelf: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    top: 50,
    width: 250,
    alignSelf: 'center',
  },
  textItem: {
    color: '#1B8AA0',
    backgroundColor: '#ffff',
    elevation: 5,
    margin: 10,
    fontSize: 22,
    alignSelf: 'center',
  },
  hobbiesCatagoryTitleList: {
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: Theme.fontFamilyRegular,
  },
  radiusSliderContainer: {
    flex: 1,
    alignItems: 'center',
  },
  searchModeList: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: '90%',
  },
});
export default styles;
