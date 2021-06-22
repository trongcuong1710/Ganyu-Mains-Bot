const mongoose = require('mongoose');

module.exports = mongoose.model(
  'quotes',
  new mongoose.Schema(
    {
      quoteName: String,
      quote: String,
      by: String,
      embed: Boolean,
    },
    { typeKey: '$type' }
  ),
  'quotes'
);
