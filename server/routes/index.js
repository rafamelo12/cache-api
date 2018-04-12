// const CacheAPI = require('../helpers/Cache');
// let cache = new CacheAPI();
const cacheAPIController = require('../controllers/cacheAPI');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Hi there!')
  });
  
  app.get('/cache/:key', cacheAPIController.getItem);
  app.get('/cache', cacheAPIController.getAllItems);
  app.delete('/cache/:key', cacheAPIController.deleteItem);
  app.delete('/cache/', cacheAPIController.deleteAllitems);
}
