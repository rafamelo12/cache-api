const CacheAPI = require('../helpers/Cache');
let cache = new CacheAPI();
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Hi there!')
  });

  app.get('/getItem', (req, res) => {
    let key = req.query.key;
    let data = cache.get(key);
    res.status(200).send({
      data: data
    });
  });

  app.delete('/deleteItem', (req, res) => {
    let key = req.query.key;
    if (cache.remove(key)) {
      res.send();
    } else {
      res.status(400).send({
        success: false,
        message: "Key doesn't exists"
      });
    }
  });

  app.get('/getKeys', (req, res) => {
    let keys = cache.getKeys();
    res.send({
      keys: keys
    });
  });

  app.delete('/clearCache', (req, res) => {
    cache.clearCache();
    res.send();
  });

  app.get('/getAllItems', (req, res) => {
    res.send({
      cache: cache.getCache()
    });
  })
}
