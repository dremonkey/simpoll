'use strict';

// ## Module Dependencies
var _ = require('lodash');
var db = require('../db');
var crypto = require('crypto');
var when = require('when');

var Schema = db.mongoose.Schema;

var QuestionModel = require('./question');

/* jshint camelcase: false */
var schema = new Schema({
  name: String,
  code: String,
  lat: Number,
  lon: Number,
  raw: String // not used
});

schema.pre('save', function (next) {
  var shasum = crypto.createHash('sha1');
  
  console.log(shasum, this);
  shasum.update(this.name + this.lat + this.lon, 'utf8');
  this.code = shasum.digest('hex').slice(0, 6);

  next();
});

schema.methods.getQAPairs = function () {
  
  var that = this;
  var deferred = when.defer();

  // get all questions
  QuestionModel.find({poll_id: that._id}, function (err, questions) {
    
    // get all answers for each question
    var promises = _.map(questions, function (question) {
      return question.answers().then(function (answers) {
        return {question: question, answers: answers};
      });
    });

    when.all(promises).then(function (pairs) {

      // Pairs will be an array containing an array of objects mapping questions to
      // an array of answers, each of which is an array of answer objects.
      //
      // For example:
      //
      // pairs = [
      //   {  
      //      question: {content: 'q1?'},
      //      answers: [{content: 'yes'}, {content: 'no'}]
      //   },
      //   {  
      //      question: {content: 'q2?'},
      //      answers: []
      //   }
      // ]

      deferred.resolve(pairs);
    });
  });
  
  return deferred.promise;
};

// Pairs will be an array containing an array of objects mapping questions to
// an array of answers, each of which is an array of answer objects.
//
// For example:
//
// pairs = [
//   {  
//      question: {content: 'q1?'},
//      answers: [{content: 'yes'}, {content: 'no'}]
//   },
//   {  
//      question: {content: 'q2?'},
//      answers: []
//   }
// ]
schema.methods.addQAPairs = function (pairs) {
  var that = this;
  var promises = [];

  _.each(pairs, function (pair) {
    promises.push(that._addQAPair(pair));
  });

  return when.all(promises);
};


// Pair should look like this:
//
// pair = {  
//    question: {content: 'q1?'},
//    answers: [{content: 'yes'}, {content: 'no'}]
// }
schema.methods._addQAPair = function (pair) {
  // create a new promise that only resolves once the answers for
  // this question has been saved
  var deferred = when.defer();

  var question = pair.question;
  var answers = pair.answers;

  var id = question._id;

  // callback to be used once the question has updated 
  // or been created to add the answers
  var createOrUpdateAnswers = function (err, question) {

    var promises = _.map(answers, function (answer) {
      var model = new QuestionModel(question);
      return model.createOrUpdateAnswer(answer);
    });

    when.all(promises).then(function (results) {
      deferred.resolve({answers: results});
    });
  };

  // add poll_id to the question object
  console.log('Poll ID', this._id);
  question.poll_id = this._id;

  // if the question already has an id, then update it
  if (id) {
    delete question._id; // remove id to prevent any errors
    QuestionModel.findByIdAndUpdate(question._id, question, createOrUpdateAnswers);
  }

  // otherwise create a new question
  else {
    QuestionModel.create(question, createOrUpdateAnswers);
  }

  return deferred.promise;
};

var Model = db.mongoose.model('Poll', schema);

module.exports = Model;