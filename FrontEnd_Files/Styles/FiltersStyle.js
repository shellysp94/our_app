import {StyleSheet} from 'react-native';
import Theme from './Theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerBlock: {
    alignItems: 'center',
    top: 20,
  },
  findNewFriendsText: {
    color: '#2C143E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filtersMenu: {
    top: 30,
    alignSelf: 'center',
    width: '90%',
    height: '80%',
  },
  myPic: {
    position: 'absolute',
    alignSelf: 'center',
  },
  modePic: {
    alignSelf: 'center',
    height: 40,
    width: 40,
  },

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
  clearText: {
    color: '#2C143E',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
    left: 35,
  },
  applyText: {
    color: '#2C143E',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
  searchIcon: {
    left: 10,
    position: 'absolute',
    justifyContent: 'center',
  },
  searchPressable: {
    backgroundColor: Theme.mainButtons,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 150,
    elevation: 5,
    borderRadius: 5,
    height: 50,
  },
  freindsOnlyBlock: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    top: 10,
    left: 20,
  },
  friendsOnlyText: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  applyBlock: {
    top: 20,
    width: 100,
    alignSelf: 'center',
  },
  viewStyle: {
    backgroundColor: Theme.backgroundColor,
    padding: 7,
    margin: 5,
    alignSelf: 'center',
    borderRadius: 5,
    width: '75%',
    borderWidth: 1,
    borderColor: '#0E6070',
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
    color: '#FFFFFF',
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
    // color: item === props.value ? 'red' : '#1B8AA0',
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
