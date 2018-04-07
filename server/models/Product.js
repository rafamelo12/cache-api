const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = Schema({
  dummyData: Number
});

module.exports = mongoose.model('Product', productSchema);
