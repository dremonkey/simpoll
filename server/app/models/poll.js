'use strict';

var db = require('../db');

var Schema = db.mongoose.Schema;

/* jshint camelcase: false */
var schema = new Schema({
  name: String,
  lat: Number,
  lon: Number,
});

var Model = db.mongoose.model('Poll', schema);

module.exports = Model;