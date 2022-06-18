import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  container: {
    height: Theme.height,
    width: Theme.width,
    backgroundColor: Theme.background,
  },
  emailPassword: {
    width: '100%',
  },

  picView: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0E6070',
    marginBottom: 10,
  },
  mainPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#3999C5',
    marginBottom: 10,
  },
  fullName: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textTitle: {
    marginTop: 15,
    marginBottom: 10,
    color: '#0E6070',
  },
  textInput: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  notValidField: {
    left: 10,
    color: 'red',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: 150,
  },
  birthday: {
    marginTop: 20,
  },
  Pressables: {
    height: 30,
    width: '80%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    left: 40,
  },
  Hobbies: {
    marginTop: 20,
    marginBottom: 20,
  },
  ButtonSection1: {
    width: 250,
    height: 70,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  subText: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    alignSelf: 'center',
    color: '#ffffff',
    marginTop: -10,
  },
  pic: {
    height: 80,
    width: 80,
    margin: 15,
    borderWidth: 2,
    borderColor: '#0E6070',
    borderRadius: 40,
    elevation: 10,
  },
  addPicSection: {
    flexDirection: 'column',
    top: 20,
    alignItems: 'center',
  },
  ButtonSection2: {
    width: 150,
    height: 70,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0E6070',
    marginBottom: 35,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  catagoryText: {
    left: 40,
    color: '#0E6070',
  },
  invalidText: {
    left: 30,
    color: 'red',
  },

  chipBlock: {
    top: 10,
    left: 40,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
  },
  catagory: {
    marginTop: 20,
  },
  dateText: {
    color: '#0E6070',
  },
  Xbutton: {
    fontSize: 18,
  },
  modalContainer: {
    padding: 20,
    elevation: 10,
    backgroundColor: '#ffff',
    height: '80%',
    width: '80%',
    marginTop: 80,
    marginLeft: 40,
  },
  cameraIcon: {
    alignSelf: 'center',
    fontSize: 40,
    marginTop: -10,
  },
});

export default styles;
