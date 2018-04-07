const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = Schema({
  key: String,
  dummyData: String
});

module.exports = mongoose.model('Product', productSchema);
