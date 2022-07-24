import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  container: {
    height: Theme.height,
    width: Theme.width,
    backgroundColor: Theme.backgroundColor,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  scroll: {
    height: '85%',
  },
  ButtonSection: {
    width: '85%',
    alignSelf: 'center',
  },
  touchablePen: {
    justifyContent: 'flex-end',
    width: 30,
    height: 30,
  },
  penPic: {
    right: 10,
    height: 25,
    width: 25,
  },
  myPic: {
    borderColor: '#0E6070',
    borderRadius: 40,
    height: 80,
    width: 80,
    alignSelf: 'center',
  },
  addPic: {
    borderColor: '#0E6070',
    borderWidth: 1,
    borderRadius: 20,
    height: 30,
    width: 30,
    justifyContent: 'center',
  },

  emailPassword: {
    width: '100%',
  },
  fullName: {
    width: '85%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    height: 40,
  },
  title: {
    color: '#0E6070',
    fontSize: 36,
    alignSelf: 'center',
  },
  textInput: {
    width: '85%',
    height: 40,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 10,
  },
  notValidField: {
    left: 10,
    color: 'red',
  },
  nameInput: {
    width: 150,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 10,
  },
  birthday: {
    marginTop: 30,
    flexDirection: 'column',
    left: 40,
  },
  datePicker: {
    width: '80%',
    marginTop: 10,
  },
  hobbies: {
    marginTop: 30,
    flexDirection: 'column',
    left: 20,
  },
  hobbiesText: {
    color: '#0E6070',
    alignSelf: 'flex-start',
    left: 20,
  },
  subText: {
    alignSelf: 'center',
  },

  addPicSection: {
    flexDirection: 'column',
    top: 30,
    alignItems: 'center',
  },
  Pressables: {
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    height: 35,
    width: '80%',
    marginTop: 10,
    marginBottom: 30,
  },
  chipsBlocks: {
    left: 20,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
  },
  dateIcon: {
    position: 'absolute',
    left: 0,
    top: 4,
    marginLeft: 0,
  },
  dateInput: {
    marginLeft: 35,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  column: {
    flexDirection: 'column',
  },
  catagoryText: {
    left: 40,
    marginTop: 15,
    color: '#FFFFFF',
  },
});

export default styles;
