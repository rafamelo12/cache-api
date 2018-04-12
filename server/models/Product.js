const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = Schema({
  key: String,
  dummyData: String,
  updatedAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: process.env.TTL || 3600
    }
  }
});

module.exports = mongoose.model('Product', productSchema);
