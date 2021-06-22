const mongoose = require('mongoose');

module.exports = mongoose.model(
  'customRoles',
  new mongoose.Schema({
    roleID: String,
    roleOwner: String,
  }),
  'customRoles'
);
