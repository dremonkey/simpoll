'use strict';

/* jshint camelcase:false */

// ## Module Dependencies
var _ = require('lodash');
var when = require('when');
var helpers = require('../helpers');

// ## Models
// var PollModel = require('../../models/poll');
var QuestionModel = require('../../models/question');

module.exports = function (server) {

  server.get('/api/polls/:id/questions', function (req, res) {
    var code = req.params.id;

    helpers.getPoll(code).then(function (result) {
      
      if (result.err) {
        helpers.responder(result.err, result.data, res);
        return;
      }

      var poll = result.poll;

      console.log('/api/polls/:id/questions', poll);

      QuestionModel.find({poll_id: poll._id}, function (err, questions) {
        var data = err && {status: 400, msg: 'Error getting questions'} || questions;

        helpers.responder(err, data, res);
      });
    });
  });

  server.post('/api/polls/:id/questions', function (req, res) {
    var code = req.params.id; // poll code
    var questions = req.body.questions;

    helpers.getPoll(code).then(function (result) {
      
      var promises = [];

      if (result.err) {
        helpers.responder(result.err, result.data, res);
        return;
      }

      var poll = result.poll;

      // Loop through each question and create or update
      for (var i = 0; i < questions.length; i++) {
        var question = questions[i];

        // Clone the question object and make sure poll_id is set
        var upsertData = _.clone(question);
        upsertData.poll_id = poll._id;

        // Delete the _id property, or Mongo will return a "mod on _id not allowed" error
        delete upsertData._id;

        // Do the upsert, which works like this: If no document exists with 
        // _id = question._id, then create a new doc using upsertData.
        // Otherwise, update the existing doc with upsertData
        var promise = null;
        if (question._id) {
          promise = QuestionModel.update({_id: question._id}, upsertData).exec();
          promises.push(promise);
        } else {
          promise = QuestionModel.create(upsertData);
          promises.push(promise);
        }
      }

      // Send a response when all questions have been saved
      when.all(promises).then(function (arr) {
        var data = {results: arr};

        helpers.responder(null, data, res);
      }).catch(function (e) {
        var data = {status: 400, msg: 'Error saving questions'};
        
        helpers.responder(e, data, res);
      });
    });
  });

  server.delete('/api/polls/:id/questions', function (req, res) {

    // var code = req.params.id; // poll code
    // var promises = [];
    var questions = req.query.ids; // question ids to delete
    
    questions = Array.isArray(questions) && questions || [questions];

    helpers.deleteQuestions(questions).then(function (arr) {
      var data = {results: arr};

      helpers.responder(null, data, res);
    }).catch(function (e) {
      var data = {status: 400, msg: 'Error deleting questions'};
      
      helpers.responder(e, data, res);
    });
  });

  server.get('/api/polls/:pId/questions/:qId', function (req, res) {
    res.send(200, {});
  });

  server.get('/api/polls/:pId/questions/:qId', function (req, res) {
    res.send(200, {});
  });

};