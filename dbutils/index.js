var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  gender: {
    type: String,
    require: true
  },
  permission: {
    type: String,
    require: true
  }
})

var User = mongoose.model('User',  userSchema);

User.getList = function(callback, limit) {
  User.find(callback).limit(limit);
}

User.findByEmail = function(callback , email) {
  User.find({ email }, callback).limit(1);
}

User.findById = function (callback, id) {
  User.find({ _id: ObjectId(id) }, callback);
}

User.add = function(user , callback){
  User.create(user, callback);
}

User.update = (data, callback) => {
  User.findByIdAndUpdate(data._id, data, callback);
}

User.removeUser = function (callback, data) {
  User.remove({ _id: ObjectId(data.id) }, callback);
}

/**
 *
 */
var employeeSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  address: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  selectedGender: {
    type: String
  },
  subscriptionType: {
    type: Array
  }
})

var Employee = mongoose.model('Employee', employeeSchema);

Employee.add = function (callback, employee) {
  Employee.create(employee, callback);
}

Employee.getList = function (callback) {
  Employee.find(callback);
}

Employee.findEmployee = function (callback , id) {
  Employee.find({ _id: ObjectId(id)},callback);
}

Employee.update = function (callback, data) {
  Employee.findByIdAndUpdate(data._id, data, callback);
}

Employee.removeEmployee = function (callback, data) {
  Employee.remove({ _id: ObjectId(data.id)}, callback);
}

module.exports = {
  User,
  Employee
}