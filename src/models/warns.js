const mongoose = require('mongoose');

module.exports = mongoose.model(
	'warns',
	new mongoose.Schema({
		warnID: Number,
		warnedMember: String,
		warnedStaff: String,
		reason: String,
		when: Date,
	}),
	'warns',
);
