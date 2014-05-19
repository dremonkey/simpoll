'use strict';

var db = require('../db');

var Schema = db.mongoose.Schema;
var ObjectId = Schema.ObjectId;

/* jshint camelcase: false */
var schema = new Schema({
  answer_id: ObjectId,
  user_id: ObjectId
});

var Model = db.mongoose.model('Vote', schema);

module.exports = Model;