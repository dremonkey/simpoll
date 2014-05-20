'use strict';

// ## Module Dependencies
var when = require('when');

// ## Models
var PollModel = require('../models/poll');
var QuestionModel = require('../models/question');

exports.responder = function (err, data, res) {
  if (err) {
    res.send(data.status, {error: data.msg, _raw: err});
  } else {
    res.send(200, data);
  }
};

exports.getPoll = function (code) {
  var deferred = when.defer();

  PollModel.find({code: code}, null, {limit: 1}, function (err, polls) {
    var poll = polls[0];

    console.log('poll', poll);

    // Stop if there is an error retrieving the poll
    if (err || !poll) {
      var data = {status: 400, msg: 'Error getting poll'};

      deferred.resolve({err: err, data: data});
      return;
    }

    deferred.resolve({err: null, poll: poll});
  });

  return deferred.promise;
};

exports.deleteQuestions = function (ids) {

  var promises = [];

  ids = Array.isArray(ids) && ids || [ids];

  console.log('Delete Questions', ids);

  // Loop through each question and create or update
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    var promise = QuestionModel.findByIdAndRemove(id).exec();
    promises.push(promise);
  }

  // return a promise that resolves when all deletion have completed
  return when.all(promises);
};