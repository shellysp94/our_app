const express = require("express");
const router = express.Router();

const {
	getAllFilters,
	getUserFilter,
	getUsersWithCommonSearchMode,
	getUsersWithCommonHobbiesFilter,
	getUsersWithCommonGenderFilter,
	getUsersWithCommonRelationshipFilter,
	getUsersWithCommonInterestingInFilter,
	getUsersWithCommonAgeFilter,
	getUserFriendsThatFilteredFriendsOnly,
	getUserFilteredUsers,
	createUserFilter,
	updateUserHobbiesFilter,
	updateUserGenderFilter,
	updateUserRelationshipFilter,
	updateUserInterestingInFilter,
	updateUserAgeFilter,
	updateUserFriendsOnlyFilter,
	deleteUserFilter,
	returnAllFiltersInSet,
} = require("../controllers/filters");

router.get("//allFiltersInSet", returnAllFiltersInSet);
router.get("/", getAllFilters); //get all chats (/chats)
router.get("/:userid", getUserFilter); //get a chat by A_userid and B_userid (/chats/:useridA/:useridB)
router.get("//searchMode", getUsersWithCommonSearchMode);
router.get("//hobbies", getUsersWithCommonHobbiesFilter);
router.get("//gender", getUsersWithCommonGenderFilter);
router.get("//relationship", getUsersWithCommonRelationshipFilter);
router.get("//interestingIn", getUsersWithCommonInterestingInFilter);
router.get("//age", getUsersWithCommonAgeFilter);
router.get("//friendsOnly/:userid", getUserFriendsThatFilteredFriendsOnly);
router.get("//filteredUsers/:userid", getUserFilteredUsers);
router.post("/:userid", createUserFilter); //post a chat (/chats/:useridA/:useridB)
router.put("/update/hobbies/:userid", updateUserHobbiesFilter);
router.put("/update/gender/:userid", updateUserGenderFilter);
router.put("/update/relationship/:userid", updateUserRelationshipFilter);
router.put("/update/interestingIn/:userid", updateUserInterestingInFilter);
router.put("/update/age/:userid", updateUserAgeFilter);
router.put(
	"/update/friendsOnly/:userid/:friendsOnly",
	updateUserFriendsOnlyFilter
);
router.delete("/:userid", deleteUserFilter); //delete a chat (/chats/:useridA/:useridB)

module.exports = router;
