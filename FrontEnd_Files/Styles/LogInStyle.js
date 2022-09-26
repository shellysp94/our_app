import {StyleSheet} from 'react-native';
import Theme from './Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.backgroundColor,
    height: Theme.height,
    width: Theme.width,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 36,
  },

  LogInForm: {
    marginTop: 80,
    alignSelf: 'center',
    width: '80%',
  },
  buttonSection: {
    marginTop: 30,
    width: 250,
    height: 70,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: Theme.secondColor,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 0,
    width: 220,
    height: 30,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    fontFamily: Theme.fontFamilyBold,
    color: '#FFFFFF',
  },
  icon: {
    height: 15,
    width: 15,
    marginRight: 5,
  },
  FormItem: {
    marginLeft: 55, 
    flexDirection: 'column',
  },
  FormItemText: {
    color: Theme.secondColor,
    fontSize: 60,
    alignSelf: 'center',
    marginBottom: 20,
    fontFamily: 'OleoScriptSwashCaps-Regular',
  },
  linkToRegister: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  textInput: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    height: 50,
    fontFamily: Theme.fontFamilyRegular,

    borderRadius: 5,
  },
  scroll: {
    top: 40,
    height: 200,
    padding: 7,
  },
  createAnAcountText: {
    color: Theme.secondColor,
    fontFamily: Theme.fontFamilyBold,
    fontSize: 18,
  },
  dontHaveAUser: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Theme.fontFamilyRegular,
  },
});

export default styles;
