import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  container: {
    height: Theme.height,
    width: Theme.width,
    backgroundColor: Theme.backgroundColor,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    alignSelf: 'center',
    color: Theme.secondColor,
    fontFamily: Theme.fontFamilyBold,
    marginTop: 30,
  },
  fullName: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  emailPassword: {
    width: Theme.width,
  },
  picView: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Theme.secondColor,
    marginBottom: 10,
  },
  mainPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Theme.highLightColor,
    marginBottom: 10,
  },
  textInput: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
  inValidField: {
    left: 10,
    color: '#525252',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: 140,
  },
  birthday: {
    marginTop: 20,
  },
  ButtonSection1: {
    width: 250,
    height: 70,
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  subText: {
    fontFamily: Theme.fontFamilyRegular,
    alignSelf: 'center',
  },
  addPicSection: {
    flexDirection: 'column',
    top: 20,
    alignItems: 'center',
  },
  viewStyle: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    padding: 7,
    margin: 5,
    borderRadius: 5,
    width: '80%',
  },
  column: {
    flexDirection: 'column',
  },
  catagoryText: {
    left: 40,
    color: Theme.secondColor,
    fontFamily: Theme.fontFamilyBold,
  },
  invalidText: {
    left: 45,
    color: '#525252',
  },
  chipBlock: {
    marginTop: 10,
    marginLeft: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '90%',
  },
  catagory: {
    marginTop: 20,
  },
  dateText: {
    color: Theme.secondColor,
    padding: 7,
    fontFamily: Theme.fontFamilyRegular,
    alignSelf: 'center',
  },
  modalContainer: {
    padding: 20,
    height: Theme.height,
    width: Theme.width,
    marginTop: 50,
  },
  cameraIcon: {
    alignSelf: 'center',
    fontSize: 40,
    marginTop: -10,
  },
  images: {
    alignSelf: 'center',
    borderRadius: 15,
    width: 350,
    height: 200,
  },
  imageTitleContainter: {
    position: 'absolute',
    zIndex: 1,
    left: 40,
    bottom: 10,
    alignSelf: 'baseline',
    justifyContent: 'flex-end',
    height: 200,
  },
  imageText: {
    color: '#FFFFFF',
    alignSelf: 'baseline',
    fontFamily: Theme.fontFamilyBold,
    fontSize: 22,
  },
  uploadImagePressable: {
    backgroundColor: Theme.secondColor,
    padding: 6,
    width: 120,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadText: {
    alignSelf: 'center',
    fontFamily: Theme.fontFamilyBold,
    color: '#FFFFFF',
  },
  skipPressble: {
    backgroundColor: Theme.highLightColor,
    padding: 6,
    width: 120,
    borderRadius: 5,
    marginTop: 10,
  },
  skipText: {
    alignSelf: 'center',
    fontFamily: Theme.fontFamilyBold,
    color: '#FFFFFF',
  },
});

export default styles;
