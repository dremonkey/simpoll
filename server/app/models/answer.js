'use strict';

var db = require('../db');

var Schema = db.mongoose.Schema;
var ObjectId = Schema.ObjectId;

var VoteModel = require('./vote');

/* jshint camelcase: false */
var schema = new Schema({
  question_id: ObjectId,
  content: String,
  display: {type: Boolean, default: true},
  votes: {type: Number, default: 0}
});

schema.methods.addVote = function () {
  var that = this;

  // Increment vote property
  this.votes++;
  this.save();

  // Create new vote
  return VoteModel.create({
    answer_id: that._id,
  });
};

schema.methods.removeVote = function () {
  var that = this;
  
  // Decrement vote property
  this.votes--;
  this.save();

  // Remove a vote
  return VoteModel.findOneAndRemove({
    answer_id: that._id,
  }).exec();
};

var Model = db.mongoose.model('Answer', schema);

module.exports = Model;