const mongoose = require('mongoose');

module.exports = mongoose.model(
	'blacklists',
	new mongoose.Schema({
		channel_id: String,
		blacklistedBy: String,
	}),
	'blacklists',
);
