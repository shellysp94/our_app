/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {useState} from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import {DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer';
import NearbyPeople from '../Screens/NearbyPeople';
import AgeItem from '../Components/Filters/AgeItem';
import SearchMode from '../Components/Filters/SearchMode';
import Radius from '../Components/Filters/Radius';
import Hobbies from '../Components/Filters/Hobbies';
import styles from '../Styles/FiltersStyle';
import FilterItem from '../Components/Filters/FilterItem';
import {Switch} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Theme from '../Styles/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {updateFilters, clearFilters} from '../store/Slices/configurationSlice';
const FiltersBarDrawer = createDrawerNavigator();

const CustomFiltersBar = props => {
  const myAge = useSelector(state => state.configuration.userConfig.age);
  const stateSearchMode = useSelector(state => state.configuration.searchMode);
  const stateFilters = useSelector(state => state.configuration.filters);
  const options = useSelector(state => state.general.rawText);

  const [age, setAge] = useState(myAge);
  const [radius, setRadius] = useState(stateFilters.radius_filter);
  const [gender, setGender] = useState(stateFilters.gender_filter);
  const [interestedIn, setInterestedIn] = useState(
    stateFilters.interested_in_filter,
  );
  const [relationship, setRelationship] = useState(
    stateFilters.relationship_filter,
  );
  const [searchMode, setSearchMode] = useState(stateSearchMode);
  const [isSwitchOn, setIsSwitchOn] = useState(
    stateFilters.friends_only_filter,
  );

  const dispatch = useDispatch();
  let hobbies = [];
  let filters = {
    search_mode_filter: searchMode,
    age_filter: [],
    hobbies_filter: 'Hobbies',
    gender_filter: gender,
    relationship_filter: relationship,
    interested_in_filter: interestedIn,
    friends_only_filter: isSwitchOn,
    radius_filter: 500,
  };

  const onApply = () => {
    dispatch(updateFilters(filters));

    props.navigation.closeDrawer();
  };
  const onClear = () => {
    dispatch(clearFilters()); // the conponent isnt renders
    setIsSwitchOn(0);
  };

  return (
    <SafeAreaView style={styles.SafeAreaView.container}>
      <View style={styles.View.headerBlock}>
        <Ionicons
          name="search-circle-outline"
          size={40}
          color={Theme.backgroundColor}
        />
        <Text style={styles.Text.findNewFriendsText}>Find new friends</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.View.filtersMenu}>
        <AgeItem myAge={age} setAge={setAge} />
        <FilterItem
          title={gender}
          arr={options.filters.Gender}
          function={setGender}
          value={gender}
        />
        <FilterItem
          title={interestedIn}
          arr={options.filters.Interested_in}
          function={setInterestedIn}
          value={interestedIn}
        />
        <FilterItem
          title={relationship}
          arr={options.registration_form.relationship_status}
          function={setRelationship}
          value={relationship}
        />
        <Hobbies
          styling={'Filters'}
          list={hobbies}
          text={hobbies.length !== 0 ? hobbies.toString() : 'Hobbies'}
        />
        <Radius value={radius} setRadius={setRadius} />
        <SearchMode
          value={searchMode}
          title={searchMode}
          function={setSearchMode}
          arr={options.filters.Search_Mode}
        />
        <View style={styles.View.freindsOnlyBlock}>
          <Switch
            value={isSwitchOn}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
            color={Theme.backgroundColor}
          />
          <Text style={styles.Text.friendsOnlyText}>Friends Only</Text>
        </View>
        <View style={styles.View.applyBlock}>
          <Pressable
            onPress={() => onApply()}
            style={styles.Pressable.searchPressable}>
            <Ionicons
              color={'#2C143E'}
              size={25}
              style={styles.Icon.searchIcon}
              name={'search-circle-outline'}
            />
            <Text style={styles.Text.applyText}>Apply</Text>
          </Pressable>

          <Pressable
            onPress={() => onClear()}
            style={styles.Pressable.trashPressables}>
            <Ionicons
              style={{
                alignSelf: 'center',
                left: 10,
              }}
              size={18}
              name={'trash-outline'}
            />
            <Text style={styles.Text.clearText}>Clear</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

function FiltersBar() {
  return (
    <FiltersBarDrawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {width: '60%', justifyContent: 'center'},
      }}
      drawerContent={props => <CustomFiltersBar {...props} />}>
      <FiltersBarDrawer.Screen
        name="NearbyPeople"
        component={NearbyPeople}
        options={{
          drawerItemStyle: {height: 0},
        }}
      />
    </FiltersBarDrawer.Navigator>
  );
}

export default FiltersBar;
