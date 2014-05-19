'use strict';

var db = require('../db');

var Schema = db.mongoose.Schema;
var ObjectId = Schema.ObjectId;

/* jshint camelcase: false */
var schema = new Schema({
  poll_id: ObjectId,
  content: String
});

var Model = db.mongoose.model('Question', schema);

module.exports = Model;