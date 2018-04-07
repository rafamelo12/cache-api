const CacheAPI = require('../helpers/Cache');
let cache = new CacheAPI();
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Hi there!')
  });

  app.get('/getKey', (req, res) => {
    let key = req.query.key;
    let data = cache.get(key);
    res.status(200).send({
      data: data
    });
  });

  app.delete('/deleteKey', (req, res) => {
    let key = req.query.key;
    cache.remove(key);
    res.send();
  });

  app.get('/keys', (req, res) => {
    let keys = cache.getKeys();
    res.send({
      keys: keys
    });
  });

  app.delete('/clearCache', (req, res) => {
    cache.clearCache();
    res.send();
  });

  app.get('/getCache', (req, res) => {
    res.send({
      cache: cache.getCache()
    });
  })
}
