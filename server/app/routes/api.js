'use strict';

/* jshint camelcase:false */

// ## Module Dependencies
var _ = require('lodash');
// var when = require('when');

var helpers = require('./helpers');
var questions = require('./api/questions');

// ## Models
var PollModel = require('../models/poll');
var QuestionModel = require('../models/question');
var AnswerModel = require('../models/answer');
// var VoteModel = require('../models/vote');

module.exports = function (server) {

  // ## Polls API

  server.get('/api/polls', function (req, res) {
    PollModel.find(function (err, polls) {
      var data = err && {status: 400, msg: 'Error getting polls'} || polls;
      
      helpers.responder(err, data, res);
    });
  });

  server.post('/api/polls', function (req, res) {
    var name = req.body.name;
    var lat = req.body.lat;
    var lon = req.body.lon;

    var poll = new PollModel({
      name: name,
      lat: lat,
      lon: lon
    });

    poll.save(function (err, poll) {
      var data = err && {status: 400, msg: 'Error saving poll'} || poll;
      
      helpers.responder(err, data, res);
    });
  });

  server.get('/api/polls/:id', function (req, res) {
    var code = req.params.id;

    PollModel.find({code: code}, null, {limit: 1}, function (err, polls) {
      var poll = polls[0];
      
      // var data = err && {status: 400, msg: 'Error getting poll'} || polls;
      if (!poll) {
        var data = {status: 400, msg: 'Error getting poll'};
        helpers.responder(data, data, res);
        return;
      }

      poll.getQAPairs().then(function (pairs) {
        
        var data = poll.toObject();
        data.qaPairs = pairs;

        // always return an array
        helpers.responder(err, [data], res);
      });
    });
  });

  // * Working
  server.post('/api/polls/:id', function (req, res) {
    var code = req.params.id;
    var name = req.body.name;
    // var lat = req.body.lat;
    // var lon = req.body.lon;
    var raw = req.body.raw;
    var qaPairs = req.body.qaPairs;

    // Update the poll
    PollModel.find({code: code}, null, {limit: 1}, function (err, polls) {
      var poll = polls[0];

      // save new data
      poll.name = name;
      poll.raw = raw || '';
      poll.save();

      poll.addQAPairs(qaPairs).then(function (results) {

        // @NOTE 
        // Results is an array of data objects that were added
        // as a result of this call. 
        //
        // Currently results only contains the last results of the promise chain (the answers)
        // 
        // @TODO make results return all results of the promise chain
        helpers.responder(null, {results: results}, res);
      });
    });
  });


  // * Working
  server.delete('/api/polls/:id', function (req, res) {
    var code = req.params.id;

    helpers.getPoll(code).then(function (result) {

      if (result.err) {
        helpers.responder(result.err, result.data, res);
        return;
      }

      var poll = result.poll;

      console.log('Preparing to delete poll', poll);

      QuestionModel.find({poll_id: poll._id}, function (err, questions) {
        
        var ids = _.map(questions, function (question) {
          return question._id;
        });

        console.log('>>>> Deleting poll questions', ids);

        helpers.deleteQuestions(ids).then(function () {
          
          // Delete the poll
          console.log('>>>> Deleting poll');
         
          poll.remove(function (err, poll) {
            var data = err && {status: 400, msg: 'Error getting poll'} || poll;

            helpers.responder(err, data, res);
          });
        });
      });
    });
  });


  // ## Questions API
  questions(server);


  // ## Answers API

  server.get('/api/polls/:pId/questions/:qId/answers', function (req, res) {
    res.send(200, {});
  });

  server.get('/api/polls/:pId/questions/:qId/answers/:aId', function (req, res) {
    // var qId = req.params.qId;
    var aId = req.params.aId;
    var qs = req.query;

    if (qs.vote === 'up') {
      AnswerModel.find({_id: aId}, null, {limit: 1}, function (err, answers) {
        
        var answer = answers[0];

        answer.addVote().then(function () {
          res.send(200, {msg: 'Successful Vote Up'});
        });
      });
    } else if (qs.vote === 'down') {
      AnswerModel.find({_id: aId}, null, {limit: 1}, function (err, answer) {
        answer.downVote().then(function () {
          res.send(200, {msg: 'Successful Vote Down'});
        });
      });
    }
  });


  // ## Votes API

  server.get('/api/polls/:pId/questions/:qId/answers/:aId/votes', function (req, res) {
    res.send(200, {});
  });
};