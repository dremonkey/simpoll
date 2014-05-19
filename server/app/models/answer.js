'use strict';

var db = require('../db');

var Schema = db.mongoose.Schema;
var ObjectId = Schema.ObjectId;

/* jshint camelcase: false */
var schema = new Schema({
  question_id: ObjectId,
  content: String,
  votes: Number
});

var Model = db.mongoose.model('Answer', schema);

module.exports = Model;