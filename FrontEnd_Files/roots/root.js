/* eslint-disable no-unused-vars */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import LogIn from '../Screens/LogIn';
import SignUp from '../Screens/SignUp';
import UplaodImageModal from '../Components/uploadImageModal';
import Home from '../Screens/Home';
import MyFriends from '../Screens/MyFriends';
import MyProfile from '../Screens/MyProfile';
import CustomSidebarMenu from '../Screens/Menu';
import NearbyPeople from '../Screens/NearbyPeople';
import Chats from '../Screens/Chats';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Settings from '../Screens/Settings';
import Notifications from '../Screens/Notifications';
import FiltersBar from '../Screens/Filters';
import Conversation from '../Screens/Conversation';

const MainDrawer = createDrawerNavigator();
const NearbyPeopleStack = createStackNavigator();
const LogInScreenStack = createStackNavigator();
const chatsAndConvScreenStack = createStackNavigator();

const ChatAndConversationsScreens = [
  {title: 'ManageChats', screen: Chats},
  {title: 'Conversation', screen: Conversation},
];
const loggingToAppScreens = [
  {title: 'Log In stack', screen: LogIn},
  {title: 'SignUp', screen: SignUp},
  {title: 'UplaodImageModal', screen: UplaodImageModal},
  {title: 'HomeStack', screen: DrawerNavi},
];

const DrawerScreens = [
  {title: 'Home', screen: Home, icon: 'home-outline'},
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
  {title: 'Settings', screen: Settings, icon: 'settings-outline'},
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
      options={{drawerIcon: () => <Ionicons name={item.icon} size={22} />}}
    />
  );
});

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
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      {DrawerItems}
    </MainDrawer.Navigator>
  );
}

export default LogInScreen;
