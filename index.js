const app = require('./server/app').app;
const port = process.env.PORT || 8080;

app.listen(port);
console.log('Witchcraft happening at port: ' + port);