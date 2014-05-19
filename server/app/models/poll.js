'use strict';

// ## Module Dependencies
var db = require('../db');
var crypto = require('crypto');

var Schema = db.mongoose.Schema;

/* jshint camelcase: false */
var schema = new Schema({
  name: String,
  code: String,
  lat: Number,
  lon: Number,
});

schema.pre('save', function (next) {
  var shasum = crypto.createHash('sha1');
  
  console.log(shasum, this);
  shasum.update(this.name + this.lat + this.lon, 'utf8');
  this.code = shasum.digest('hex').slice(0, 6);

  next();
});

var Model = db.mongoose.model('Poll', schema);

module.exports = Model;