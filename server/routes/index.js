const CacheAPI = require('../helpers/Cache');
let cache = new CacheAPI(3);
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Hi there!')
  });

  app.put('/insert', (req, res) => {
    let key = req.body.key;
    try {
      cache.put(key);
      res.status(200).send({
        cache: cache.cache
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({err: err.message});
    }
  });

  app.get('/get', (req, res) => {
    let key = req.query.key;
    try {
      let data = cache.get(key);
      res.status(200).send({
        data: data
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({err: err.message});
    }
  });

  app.delete('/delete', (req, res) => {
    let key = req.query.key;
    try {
      cache.remove(key);
      res.send();
    } catch (err) {
      res.status(500).send({err: err.message});
    }
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
