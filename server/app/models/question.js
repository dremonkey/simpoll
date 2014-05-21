'use strict';

var _ = require('lodash');
var db = require('../db');
var when = require('when');

var Schema = db.mongoose.Schema;
var ObjectId = Schema.ObjectId;

var AnswerModel = require('./answer');

/* jshint camelcase: false */
var schema = new Schema({
  poll_id: ObjectId,
  content: String,
  position: Number
});

schema.methods.answers = function () {
  var that = this;
  return AnswerModel.find({'question_id': that._id}).exec();
};

schema.methods.addAnswer = function (content) {
  var that = this;

  return AnswerModel.create({
    question_id: that._id,
    content: content
  });
};

schema.methods.deleteAnswers = function () {
  var deferred = when.defer();

  this.answers.then(function (answers) {
    
    _.each(answers, function (answer) {
      answer.remove();
    });

    deferred.resolve();
  });

  return deferred.promise;
};


// @param data {object}
//
// data = {
//    _id: String // optional
//    content: String
// }
// 
schema.methods.createOrUpdateAnswer = function (data) {
  var promise;
  var id = data._id;

  // add question_id to the answer object
  data.question_id = this._id;

  if (id) {
    delete data._id; // remove id to prevent any errors
    promise = AnswerModel.findByIdAndUpdate(id, data).exec();
  }

  // create a new answer
  else {
    promise = AnswerModel.create(data);
  }

  // return a promise
  return promise;
};

var Model = db.mongoose.model('Question', schema);

module.exports = Model;