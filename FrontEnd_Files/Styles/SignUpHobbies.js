import {StyleSheet} from 'react-native';
// import Theme from './Theme';
const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: '#EBEBEB', // birthday,hobbies
    marginLeft: 30,
    padding: 7,
    margin: 5,
    borderRadius: 5,
    width: '80%',
    borderWidth: 1,
    borderColor: 'white',
    elevation: 5,
    height: 50,
    justifyContent: 'center',
  },
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
  itemPressable: {
    justifyContent: 'center',
    width: 280,
  },
});
export default styles;
