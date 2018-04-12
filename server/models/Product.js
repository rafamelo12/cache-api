const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = Schema({
  key: String,
  dummyData: String,
  TTL: {
    type: Date,
    default: Date.now,
    expires: process.env.TTL || '60s'
  }
});

module.exports = mongoose.model('Product', productSchema);
