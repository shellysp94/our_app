/* eslint-disable no-unused-vars */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import LogIn from '../Screens/LogIn';
import SignUp1 from '../Screens/SignUp/SignUp1';
import SignUp2 from '../Screens/SignUp/SignUp2';
import SignUp3 from '../Screens/SignUp/SignUp3';
import SignUp4 from '../Screens/SignUp/SignUp4';
import newHome from '../Screens/newHome';
import MyFriends from '../Screens/MyFriends';
import MyProfile from '../Screens/MyProfile';
import CustomSidebarMenu from '../Screens/Menu';
import NearbyPeople from '../Screens/NearbyPeople';
import Chats from '../Screens/Chats';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Notifications from '../Screens/Notifications';
import FiltersBar from '../Screens/Filters';
import Conversation from '../Screens/Conversation';
import Theme from '../Styles/Theme';

const MainDrawer = createDrawerNavigator();
const NearbyPeopleStack = createStackNavigator();
const LogInScreenStack = createStackNavigator();
const chatsAndConvScreenStack = createStackNavigator();

const ChatAndConversationsScreens = [
  {title: 'ManageChats', screen: Chats},
  {title: 'Conversation', screen: Conversation},
];
const SignUpStack = [
  {title: 'SignUp1', screen: SignUp1},
  {title: 'SignUp2', screen: SignUp2},
  {title: 'SignUp3', screen: SignUp3},
  {title: 'SignUp4', screen: SignUp4},
  {title: 'Log In stack', screen: LogIn},
];
const loggingToAppScreens = [
  {title: 'Log In stack', screen: LogIn},
  {title: 'newHome', screen: newHome, icon: 'home-outline'},
  {title: 'SignUp', screen: SignUpScreen},
  {title: 'UploadPictures', screen: SignUp4},
  {title: 'HomeStack', screen: DrawerNavi},
];

const DrawerScreens = [
  {title: 'Home', screen: newHome, icon: 'home-outline'},
  {title: 'My Profile', screen: MyProfile, icon: 'person-circle-outline'},
  {title: 'My Friends', screen: MyFriends, icon: 'people-circle-outline'},
  {
    title: 'Nearby People',
    screen: NearbyPeopleScreen,
    icon: 'magnet-outline',
  },
  {
    title: 'Notifications',
    screen: Notifications,
    icon: 'notifications-outline',
  },
  {
    title: 'Chats',
    screen: ChatsAndConvScreen,
    icon: 'chatbox-ellipses-outline',
  },
  {title: 'UploadPictures', screen: SignUp4, icon: 'image-outline'},
];

function FiltersBarScreen() {
  return <FiltersBar />;
}

function NearbyPeopleScreen() {
  return (
    <NearbyPeopleStack.Navigator screenOptions={{headerShown: false}}>
      <NearbyPeopleStack.Screen name="Filters" component={FiltersBarScreen} />
      <NearbyPeopleStack.Screen name="NearbyPeople" component={NearbyPeople} />
    </NearbyPeopleStack.Navigator>
  );
}

const chatAndConversationsItems = ChatAndConversationsScreens.map(item => {
  return (
    <MainDrawer.Screen
      name={item.title}
      component={item.screen}
      key={item.screen}
    />
  );
});

const SignUpStackItems = SignUpStack.map(item => {
  return (
    <MainDrawer.Screen
      name={item.title}
      component={item.screen}
      key={item.screen}
    />
  );
});
const loggingToAppItems = loggingToAppScreens.map(item => {
  return (
    <MainDrawer.Screen
      name={item.title}
      component={item.screen}
      key={item.screen}
    />
  );
});

const DrawerItems = DrawerScreens.map(item => {
  return (
    <MainDrawer.Screen
      name={item.title}
      key={item.title}
      component={item.screen}
      options={
        item.title !== 'My Profile' && item.title !== 'UploadPictures'
          ? {
              drawerLabelStyle: {
                fontFamily: Theme.fontFamilyBold,
                color: Theme.secondColor,
              },
              activeBackgroundColor: {backgroundColor: '#316172'},
              drawerIcon: () => (
                <Ionicons
                  color={Theme.secondColor}
                  name={item.icon}
                  size={22}
                />
              ),
            }
          : {
              drawerItemStyle: {display: 'none'},
            }
      }
    />
  );
});

function SignUpScreen() {
  return (
    <chatsAndConvScreenStack.Navigator screenOptions={{headerShown: false}}>
      {SignUpStackItems}
    </chatsAndConvScreenStack.Navigator>
  );
}

function ChatsAndConvScreen() {
  return (
    <chatsAndConvScreenStack.Navigator screenOptions={{headerShown: false}}>
      {chatAndConversationsItems}
    </chatsAndConvScreenStack.Navigator>
  );
}
function LogInScreen() {
  return (
    <NavigationContainer>
      <LogInScreenStack.Navigator screenOptions={{headerShown: false}}>
        {loggingToAppItems}
      </LogInScreenStack.Navigator>
    </NavigationContainer>
  );
}
function DrawerNavi() {
  return (
    <MainDrawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Theme.highLightColor,
        drawerInactiveTintColor: Theme.secondColor,
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      {DrawerItems}
    </MainDrawer.Navigator>
  );
}

export default LogInScreen;
