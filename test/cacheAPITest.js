const mocha = require('mocha');
const chai  = require('chai');
const request = require('supertest');
const axios = require('axios');
const expect = chai.expect;
const app = require('../server/app').app;
const closeMongooseConnection = require('../server/app').closeMongoose;

describe('cache-api', () => {
  before(() => {
    process.env.CACHE_MAX_SIZE = 3;
    process.env.DB_URI = 'mongodb://localhost/cache-api-test'
  });

  after(() => {
    closeMongooseConnection();
  });

  it('GET /cache/:key', () => {
    request(app)
      .get('/cache/1')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.dummyData).to.be.an('string').and.to.not.equal('');
      });
  });

  it('GET /cache', () => {
    request(app)
      .get('/cache')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.cache).to.be.an('array');
        done();
      });
  });

  it('DELETE /cache/:key', () => {
    request(app)
      .delete('/cache/1')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        request(app)
          .get('/cache')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err ,res) => {
            if (err) return done(err);
            expect(() => res.body.cache.map(item => item.key)).to.be.an('array').that.does.not.include('1');
            done();
          })
      });
  });

  it('DELETE /cache', () => {
    request(app)
      .delete('/cache')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        request(app)
          .get('/cache')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.cache).to.be.an('array').that.is.empty;
            done();
          })
      });
  });
});
