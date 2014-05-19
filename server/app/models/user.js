'use strict';

var db = require('../db');

var Schema = db.mongoose.Schema;

/* jshint camelcase: false */
var schema = new Schema({
  username: String
});

var Model = db.mongoose.model('User', schema);

module.exports = Model;