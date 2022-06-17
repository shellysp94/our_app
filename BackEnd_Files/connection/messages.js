const moment = require("moment");

// create a message
let generateMessage = function (from, text) {
	return {
		from,
		text,
		createdAt: moment().valueOf(),
	};
};

// create a current location
let generateLocationMessage = function (from, lat, lng) {
	return {
		from,
		url: `https://www.google.com/maps?q=${lat}, ${lng}`,
		createdAt: moment().valueOf(),
	};
};

module.exports = {
	generateMessage,
	generateLocationMessage,
};
