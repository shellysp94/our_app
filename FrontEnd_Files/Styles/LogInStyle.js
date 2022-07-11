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
    marginTop: 330,
    width: 250,
    height: 70,
    alignSelf: 'center',
    justifyContent: 'space-between',
    zIndex: 0,
    position: 'absolute',
  },
  button: {
    backgroundColor: '#005252',
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 0,
    width: 220,
    height: 30,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  icon: {
    height: 15,
    width: 15,
    marginRight: 5,
  },
  FormItem: {
    marginLeft: 55, //FIX ME
    flexDirection: 'column',
  },
  FormItemText: {
    color: '#ffffff',
    fontSize: 34,
    alignSelf: 'center',
    marginBottom: 20,
  },
  linkToRegister: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textInput: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
    height: 50,
    borderRadius: 5,
  },
  scroll: {
    top: 40,
    height: 200,
    padding: 7,
  },
  createAnAcountText: {
    color: '#005252',
    fontWeight: 'bold',
  },
  dontHaveAUser: {
    color: '#FFFFFF',
  },
});

export default styles;
