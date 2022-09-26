/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import {View, SafeAreaView, Text, Pressable} from 'react-native';
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
import {
  updateFilters,
  updateOneFilter,
  clearFilters,
} from '../store/Slices/configurationSlice';
import {applyPressed} from '../store/Slices/peopleSlice';
const FiltersBarDrawer = createDrawerNavigator();

const CustomFiltersBar = props => {
  //--------------select values from state-------------
  const options = useSelector(state => state.general.rawText);
  const search_mode_filter = useSelector(
    state => state.configuration?.filters.search_mode_filter,
  );
  const hobbies_filter = useSelector(
    state => state.configuration?.filters.hobbies_filter,
  );
  const gender_filter = useSelector(
    state => state.configuration.filters.gender_filter,
  );
  const relationship_filter = useSelector(
    state => state.configuration?.filters.relationship_filter,
  );
  const interested_in_filter = useSelector(
    state => state.configuration?.filters.interested_in_filter,
  );
  const age_filter = useSelector(
    state => state.configuration?.filters.age_filter,
  );
  const friends_only_filter = useSelector(
    state => state.configuration?.filters.friends_only_filter,
  );
  const radius_filter = useSelector(
    state => state.configuration?.filters.radius_filter,
  );
  const online_filter = useSelector(
    state => state.configuration?.filters.online_filter,
  );
  const isApplyPressed = useSelector(state => state.people.applyPressed);
  //---------------------------------------------------

  const dispatch = useDispatch();
  let hobbies = [];
  let filters = {
    search_mode_filter: search_mode_filter,
    age_filter: age_filter,
    hobbies_filter: 'Hobbies',
    gender_filter: gender_filter,
    relationship_filter: relationship_filter,
    interested_in_filter: interested_in_filter,
    friends_only_filter: friends_only_filter,
    online_filter: online_filter,
    radius_filter: radius_filter,
  };

  //When Apply button is pressed the state update and the POST filters call runs
  const onApply = () => {
    dispatch(updateFilters({filters: filters}));
    dispatch(applyPressed({pressed: !isApplyPressed}));
    props.navigation.closeDrawer();
  };
  //When Clear button is pressed the state is Initialized
  const onClear = () => {
    dispatch(clearFilters());
  };

  //NOTICE: AgeItem, FilterItem, Hobbies, Radius and SearchMode are components we created. Each of the codes is located in the Components\Filters folder in the file as the component name

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
        <AgeItem myAge={age_filter} />
        <FilterItem
          filter={'gender_filter'}
          title={gender_filter}
          arr={options.filters.Gender}
        />
        <FilterItem
          filter={'interested_in_filter'}
          title={interested_in_filter}
          arr={options.filters.Interested_in}
        />
        <FilterItem
          filter={'relationship_filter'}
          title={relationship_filter}
          arr={options.registration_form.relationship_status}
        />
        <Hobbies
          styling={'Filters'}
          list={hobbies_filter}
          text={hobbies.length !== 0 ? hobbies.toString() : 'Hobbies'}
        />
        <Radius value={radius_filter} />
        <SearchMode
          title={search_mode_filter}
          filter={'search_mode_filter'}
          arr={options.filters.Search_Mode}
        />
        <View style={styles.View.freindsOnlyBlock}>
          <Switch
            value={friends_only_filter}
            onValueChange={() => {
              const tempFilter = friends_only_filter === true ? false : true;
              dispatch(
                updateOneFilter({
                  filter: 'friends_only_filter',
                  item: tempFilter,
                }),
              );
            }}
            color={Theme.secondColor}
          />
          <Text adjustsFontSizeToFit style={styles.Text.friendsOnlyText}>
            Friends Only
          </Text>
        </View>
        <View style={styles.View.OnlineOnlyBlock}>
          <Switch
            value={online_filter}
            onValueChange={() => {
              const tempFilter = online_filter === true ? false : true;
              dispatch(
                updateOneFilter({
                  filter: 'online_filter',
                  item: tempFilter,
                }),
              );
            }}
            color={Theme.secondColor}
          />
          <Text adjustsFontSizeToFit style={styles.Text.friendsOnlyText}>
            Online People Only
          </Text>
        </View>
        <View style={styles.View.applyBlock}>
          <Pressable
            onPress={() => onApply()}
            style={styles.Pressable.searchPressable}>
            <Ionicons
              color={'#ffffff'}
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
              style={styles.Icon.clearIcon}
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
