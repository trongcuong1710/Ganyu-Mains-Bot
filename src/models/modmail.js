const mongoose = require('mongoose');

module.exports = mongoose.model(
  'modmail',
  new mongoose.Schema({
    channel_id: String,
    member_id: String,
  }),
  'modmail'
);
