const moment = require("moment");

function formatMessage(sender_user_id, receiver_user_id, sender_name, text) {
	return {
		sender_user_id,
		receiver_user_id,
		sender_name,
		text,
		time: moment().format("h:mm a"),
	};
}

module.exports = formatMessage;
