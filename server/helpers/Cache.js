const randomString = require('randomstring');
const Product = require('../models/Product');
class CacheAPI {
  constructor(maxSize, duration) {
    this.cache = Object.create(null);
    this.maxSize = maxSize || 100;
    this.duration = duration || 60000;
    this.size = 0;
  }

  put(key) {
    if (typeof key === 'undefined') {
      throw new Error('Key can\'t be undefined!');
    }

    let oldRecord = this.cache[key];
    if (oldRecord) {
      oldRecord.value = randomString.generate();
      oldRecord.TTL = Date.now() + this.duration;
      this.saveToDB(key, oldRecord.value);
      return oldRecord;
    } else {
      let value = randomString.generate();
      if (this.size < this.maxSize) {
        this.saveToDB(key, value);
        this.cache[key] = {
          value: value,
          TTL: Date.now() + this.duration
        }
        this.size++;
      } else {
        this.saveToDB(key, value);
        this.remove(this.getOldestRecord());
        this.cache[key] = {
          value: value,
          TTL: Date.now() + this.duration
        }
      }
      return this.cache[key];
    }
  }

  get(key) {
    if (typeof key === 'undefined' || key === '') {
      throw new Error('Key can\'t be undefined!');
    }

    let data = this.cache[key];
    if (data && Date.now() < data.TTL) {
      console.log('Cache hit!');
      this.cache[key].TTL = Date.now() + this.duration;
      return data;
    } else {
      console.log('Cache miss!');
      data = {};
      data.value = randomString.generate();
      return this.put(key);
    }
  }

  remove(key) {
    if (typeof key === 'undefined') {
      throw new Error('Key can\'t be undefined!');
    }

    if (!this.checkIfKeyExists(key)) {
      return false;
    }
    return delete this.cache[key];
  }

  clearCache() {
    this.cache = Object.create(null);
    this.size = 0;
    return true;
  }

  getCache() {
    return this.cache;
  }

  getKeys() {
    return Object.keys(this.cache);
  }

  getOldestRecord() {
    let arr = Object.entries(this.cache);
    arr.sort((a,b) => {
      if (a[1].TTL < b[1].TTL) return -1;
      if (a[1].TTL > b[1].TTL) return 1;
      return 0;
    });
    return arr[0][0];
  }

  checkIfKeyExists(key) {
    let keys = Object.keys(this.cache);
    return keys.includes(key);
  }

  saveToDB(key, data) {
    Product.findOne({key: key}, (err, product) => {
      if (err) throw new Error(err);
      if (product) {
        product.dummyData = data;
        product.save((err, updatedProduct) => {
          if (err) throw new Error(err);
          return true;
        });
      } else {
        Product.create({key: key, dummyData: data}, (err) => {
          if (err) throw new Error(err);
          return true;
        })
      }
    })
  }
}

module.exports = CacheAPI;
