const mocha = require('mocha');
const chai  = require('chai');
const expect = chai.expect;
const Cache = require('../server/helpers/Cache');

describe('cache-api', () => {
  beforeEach(() => {
    cache = new Cache(5);
  });

  describe('constructor', () => {
    it('should create a cache', () => {
      expect(() => {
        cache = new Cache(5, 5);
      }).to.not.throw();
    });

    it('should not allow to create a cache with negative size', () => {
      expect(() => {
        new Cache(-1);
      }).to.throw();
    });

    it('should not allow to create a cache with negative duration time', () => {
      expect(() => {
        new Cache(10, -1);
      }).to.throw();
    });

  })

  describe('put method', () => {
    it('should allow adding a new item to the cache', () => {
      expect(() => {
        cache.put('1');
      }).to.not.throw();
    });

    it('should not allow adding a new item without a key', () => {
      expect(() => {
        cache.put();
      }).to.throw();
    });

    it('should not allow adding a new item with empty key', () => {
      expect(() => {
        cache.put('');
      }).to.throw();
    });
  });

  describe('get method', () => {
    beforeEach(() => {
      cache = new Cache(5);
      cache.put('1');
    });

    it('cache should contain the key = 1', () => {
      expect(
        cache.getKeys()
      ).to.includes('1');
    });

    it('should not allow get without key', () => {
      expect(() => {
        cache.get();
      }).to.throw();
    });

    it('should not allow get with empty key', () => {
      expect(() => {
        cache.get('');
      }).to.throw();
    });

    it('should create a new key entry', () => {
      cache.get('2');
      expect(cache.getKeys()).to.include('2');
    });
  });

  describe('remove method', () => {
    beforeEach(() => {
      cache = new Cache(5);
      cache.put('1');
      cache.put('2');
    });

    it('should remove an existing key', () => {
      expect(cache.remove('2')).to.be.true;
    });

    it('should not remove an unexisting key', () => {
      expect(cache.remove('3')).to.be.false;
    });

    it('should not allow removing an empty key', () => {
      expect(() => {
        cache.remove('');
      }).to.throw();
    });

    it('should not allow removing an undefined key', () => {
      expect(() => {
        cache.remove();
      }).to.throw();
    });
  });

  describe('clear cache method', () => {
    beforeEach(() => {
      cache = new Cache();
      cache.put('1');
      cache.put('2');
    });

    it('should clear the cache', () => {
      cache.clearCache();
      expect(cache.size).to.equal(0);
    });
  });

  describe('get keys', () => {
    beforeEach(() => {
      cache = new Cache();
      cache.put('1');
      cache.put('2');
    });

    it('should return an array with 2 keys', () => {
      expect(cache.getKeys()).to.have.length(2);
    });

    it('should have different keys length after removing an key', () => {
      beforeTotalKeys = cache.getKeys().length;
      cache.remove('1');
      expect(cache.getKeys().length).to.equal(beforeTotalKeys - 1);
    });

    it('should have different keys length after adding a key', () => {
      beforeTotalKeys = cache.getKeys().length;
      cache.put('3');
      expect(cache.getKeys().length).to.equal(beforeTotalKeys + 1);
    });
  });

  describe('get oldest record', () => {
    beforeEach(() => {
      cache = new Cache(5);
      cache.put('1');
      cache.put('2');
      cache.put('3');
    });

    it('should get the oldest record', () => {
      expect(cache.getOldestRecord()).to.equal('1');
    });

    it('should get oldest record even if we add new records', () => {
      cache.put('4');
      expect(cache.getOldestRecord()).to.equal('1');
    });

    it('should get oldest record even if we delete a record', () => {
      cache.remove('2');
      expect(cache.getOldestRecord()).to.equal('1');
    })

    it('should get the second oldest record after we remove the oldest', () => {
      cache.remove('1');
      expect(cache.getOldestRecord()).to.equal('2');
    });

    it('should get the second oldest record if we update the oldest record', () => {
      cache.get('1');
      setTimeout(() => {
        expect(cache.getOldestRecord()).to.equal('2');
      }, 100);
    });
  });

  describe('check if key exists', () => {
    beforeEach(() => {
      cache = new Cache();
      cache.put('1');
      cache.put('2');
    });

    it('should say that key 1 exists', () => {
      expect(cache.checkIfKeyExists('1')).to.be.true;
    });

    it('should say that key doesn\'t exists after key removal', () => {
      cache.remove('1');
      expect(cache.checkIfKeyExists('1')).to.be.false;
    });
  });
});
