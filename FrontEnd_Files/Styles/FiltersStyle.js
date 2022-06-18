import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBlock: {
    alignItems: 'center',
    top: 20,
  },
  findNewFriendsText: {
    color: '#1B8AA0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filtersMenu: {
    top: 30,
    alignSelf: 'center',
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
    justifyContent: 'center',
    alignSelf: 'center',
    width: 150,
    marginTop: 10,
    elevation: 5,
    borderRadius: 5,
    height: 40,
  },
  trashIcon: {
    left: 10,
    position: 'absolute',
    justifyContent: 'center',
  },
  clearText: {
    color: '#0E6070',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
  applyText: {
    color: '#FFFFFF',
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
    backgroundColor: '#286F6D',
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
    backgroundColor: '#61AF9B',
    padding: 7,
    margin: 5,
    borderRadius: 5,
    width: 140,
    borderWidth: 1,
    borderColor: '#0E6070',
    elevation: 5,
  },
  itemPressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  center: {
    justifyContent: 'center',
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
