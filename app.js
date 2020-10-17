var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const express = require('express'),
      bodyParser = require('body-parser'),
      app = express();
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      

const admin = require('firebase-admin')
var serviceAccount = require("./as-libre-firebase-adminsdk-tchz0-e2b0887bd4.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://as-libre.firebaseio.com/'
})

var usersRouter = require('./routes/users');
var productRouter = require('./routes/productos');


// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/products', productRouter);

module.exports = app;
