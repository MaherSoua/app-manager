var jwt = require('jsonwebtoken');
var Router = require('router');
var bcrypt = require('bcryptjs');
var Router = require('router');
var session = require('express-session');
var router = Router();
var {User, Employee} = require('../dbutils');
const EXPIRE_TIME = 3600;


router.use((err, res, next) => {

  var token = res.req.query.token;
  if (token && token != 'null'){
    var decoded = jwt.verify(token, 'secret', (error, decoded) => {
      if (Boolean(error)) {
        return res.status('505').json({ message: 'Token not valid' });
      }
      next();
    });
  } else {
    if(res.req.path == '/login'){
      next()
    } else {
      res.status('500').json({ message: 'Login Error' });
    }
  }
});

router.post('/login', (req, res, next) => {
  var user = {};
  var email = req.body.email;
  var password = bcrypt.hashSync(req.body.password , 10);


  var user = User.findByEmail( (err, result) => {

    if(err || (result && result.length == 0)) {
      return res.status('500').json({ message: 'Login Error' });
    }

   if(bcrypt.compareSync(req.body.password, result[0].password)){
     var token = jwt.sign({ token: email + '-' + password }, 'secret', { expiresIn: EXPIRE_TIME });
     res.status('200').json({ message: 'Succeful_login', token });
   } else {
     res.status('500').json({ message: 'Login Error' });
   }
  },email);
});

router.get('/checkToken', (req, res, next) => {
  var token = req.query.token;
  res.status('200').json({ message: 'Succeful_login', token });
});

router.post('/addUser', (req, res, next) => {
  var data = req.body;
  data.password = bcrypt.hashSync(req.body.password , 10);
  User.add( data , function(err, stored){
    if(err){
      return res.status('405').json({
        message: err
      })
    }
    res.status('200').json({
      message: stored
    });
  })
});

router.get('/getUsers', (req, res, next) => {
  var token = req.query.token;

  User.getList((err, response) => {
    if(err) {
      return res.status('405').json({
        message: err
      })
    }
    res.status('200').json({
      list: response
    });
  });
});

router.post('/addEmployee', (req, res, next) => {
  var data = req.body;
  Employee.add(function (err, stored) {
    if (err) {
      return res.status('405').json({
        message: err
      })
    }
    res.redirect('getEmployeeList?token=' + req.query.token);
  }, data)
});

router.get('/getEmployeeList', (req, res, next) => {
  Employee.getList(function (err, stored) {
    if (err) {
      return res.status('405').json({
        message: err
      })
    }
    res.status('200').json({
      list: stored
    });
  })
});

router.get('/getEmployeeById', (req, res, next) => {
  var id = req.query.id
  Employee.findEmployee(function (err, employee) {
    if (err) {
      return res.status('405').json({
        message: err
      })
    }
    res.status('200').json({
      result: employee
    });
  }, id)
});

router.get('/getUserById', (req, res, next) => {
  var id = req.query.id
  User.findById(function (err, user) {
    if (err) {
      return res.status('405').json({
        message: err
      })
    }

    res.status('200').json({
      result: user[0]
    });
  }, id)
});

router.post('/updateEmployee', (req, res, next) => {
  var employee = req.body
  Employee.update(function (err) {
    if (err) {
      return res.status('405').json({
        message: err
      })
    }
    res.redirect('getEmployeeList?token=' + req.query.token);
  }, employee)
});

router.post('/removeEmployee', (req, res, next) => {
  var employee = req.body
  Employee.removeEmployee(function (err) {
    if (err) {
      return res.status('405').json({
        message: err
      })
    }
    res.redirect('getEmployeeList?token=' + req.query.token);
  }, employee)
});

router.post('/removeUser', (req, res, next) => {
  var user = req.body
  User.removeUser(function (err) {
    if (err) {
      return res.status('405').json({
        message: err
      })
    }
    res.redirect('getUsers?token=' + req.query.token);
  }, user)
});

router.post('/logout', (req, res, next) => {
  res.status('200').json({
    message: 'logout_success',
    token: null
  });
});

module.exports = router;