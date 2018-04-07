const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = Schema({
  dummyData: String
});

module.exports = mongoose.model('Product', productSchema);
