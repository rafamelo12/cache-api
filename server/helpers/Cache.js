const randomString = require('randomstring');
const Product = require('../models/Product');
class CacheAPI {

  /*
    Default Constructor for the Cache API Class
    @params:
    maxSize: Maximum size of the cache (int).
    duration: Duration in ms that the items in the cache should persist in it. (int)
  */

  constructor(maxSize, duration ) {
    if (typeof maxSize !== 'undefined' && maxSize < 0) {
      throw new Error('Cache size can\'t be negative!');
    }

    if (typeof duration !== 'undefined' && duration < 0) {
      throw new Error('Item lifetime can\'t be negative!');
    }

    this.cache = Object.create(null);
    this.maxSize = maxSize || 100;
    this.duration = duration || 60000;
    this.size = 0;
  }

  /*
    put
    Responsible for inserting a new record into the cache
    @params:
    key: The key that will identify the object content. (string)

    This method also includes a setTimeout in the newly created object in the cache
    Since in the scope of this application we will return a new value whenever we have
    a cache miss, if the TTL is surpassed the setTimeout will remove the key from the cache
  */

  put(key) {
    if (typeof key === 'undefined' || key === '') {
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
      let TTL = Date.now() + this.duration;
      if (this.size < this.maxSize) {
        this.saveToDB(key, value);
        this.cache[key] = {
          value: value,
          TTL: TTL
        }
        this.size++;
      } else {
        this.saveToDB(key, value);
        this.remove(this.getOldestRecord());
        this.cache[key] = {
          value: value,
          TTL: TTL
        }
      }
      setTimeout(() => {
        this.remove(key);
      }, this.duration);
      return this.cache[key];
    }
  }

  /*
    get
    Responsible for getting a object from the cache.
    It will also log if it was a Cache hit or miss.
    @params:
    key: key wanted from the object (string).
  */

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

  /*
    removeMethod
    Responsible for removing an object from the cache given its key.
    @params:
    key: Key for the object in the cache (string)
  */

  remove(key) {
    if (typeof key === 'undefined' || key === '') {
      throw new Error('Key can\'t be undefined!');
    }

    if (!this.checkIfKeyExists(key)) {
      return false;
    }
    return delete this.cache[key];
  }

  /*
    clearCache
    Responsible for erasing the cache.
  */

  clearCache() {
    this.cache = Object.create(null);
    this.size = 0;
    return true;
  }

  /*
    getCache
    Responsible for returning the cache with all of its objects
  */

  getCache() {
    return this.cache;
  }

  /*
    getKeys
  */

  getKeys() {
    return Object.keys(this.cache);
  }

  /*
    getOldestRecord
    Method responsible for getting the oldest record in the cache.
    If the cache is full, it will get the oldest record and delete it.
    Since we update the TTL on every Cache hit, we'll be eliminating
    the least frequently used element from the cache.
  */

  getOldestRecord() {
    let arr = Object.entries(this.cache);
    arr.sort((a,b) => {
      if (a[1].TTL < b[1].TTL) return -1;
      if (a[1].TTL > b[1].TTL) return 1;
      return 0;
    });
    return arr[0][0];
  }

  /*
    checkIfKeyExists
    Method responsible for checking if a giving key is available in the cache.
    @params:
    key: Key of the wanted object (string)
  */

  checkIfKeyExists(key) {
    let keys = Object.keys(this.cache);
    return keys.includes(key);
  }

  /*
    saveToDB
    Method that will persists the updated data to DB.
    @params:
    key: Key of the object in cache (string)
    data: The new data it will shall save to the object in the DB.
  */

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
