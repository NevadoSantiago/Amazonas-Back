var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

const express = require('express'),
      bodyParser = require('body-parser'),
      app = express();
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      app.use(cors())
      

const admin = require('firebase-admin')
var serviceAccount = require("./as-libre-firebase-adminsdk-tchz0-e2b0887bd4.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://as-libre.firebaseio.com/'
})

var usersRouter = require('./routes/users');
var productRouter = require('./routes/productos');
var categoriaRouter = require('./routes/categorias');
var pedidosRouter = require('./routes/pedidos');

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/categorias', categoriaRouter);
app.use('/pedidos', pedidosRouter);

module.exports = app;
