var express = require('express');
var router = require('./router');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var port = 8000;

/**
 *
 */
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin' , '*')
  res.setHeader('Access-Control-Allow-Headers' , 'Origin, X-Requested-With, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});
/**
 *
 */
app.listen(port , function() {
  console.log('Server is starting at port '+port)
});

/**
 *
 */
mongoose.connect('mongodb://localhost/employees', { useMongoClient: true }, function(){
  console.log('Connected to database');
})
/**
 *
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 *
 */
app.use('/api' , router)