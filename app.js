const express   = require('express');
const app       = express();
const port      = process.env.PORT || 8080;

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}));

/* DB CONNECTION */
const dbConfig = require('./server/config/db');
mongoose.connect(dbConfig.uri);

/* ROUTES */
require('./server/routes/index')(app);

app.listen(port);
console.log('Witchcraft happening at port: ' + port);
