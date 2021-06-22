const mongoose = require('mongoose');

module.exports = mongoose.model(
  'ignoreList',
  new mongoose.Schema({
    member_id: String,
    ignoredBy: String,
  }),
  'ignoreList'
);
