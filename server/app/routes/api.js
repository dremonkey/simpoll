'use strict';

// ## Module Dependencies
var PollModel = require('../models/poll');
// var QuestionModel = require('../models/question');
// var AnswerModel = require('../models/answer');
// var VoteModel = require('../models/vote');

var responder = function (err, data, res) {
  if (err) {
    res.send(data.status, {error: data.msg, _raw: err});
  } else {
    res.send(200, data);
  }
};

module.exports = function (server) {

  // ## Polls API

  server.get('/api/polls', function (req, res) {
    PollModel.find(function (err, polls) {
      var data = err && {status: 400, msg: 'Error getting polls'} || polls;
      
      responder(err, data, res);
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
      
      responder(err, data, res);
    });
  });

  server.get('/api/polls/:id', function (req, res) {
    var id = req.params.id;

    PollModel.find({_id: id}, null, {limit: 1}, function (err, poll) {
      var data = err && {status: 400, msg: 'Error getting poll'} || poll;

      responder(err, data, res);
    });
  });

  server.put('/api/polls/:id', function (req, res) {
    res.send(200, {});
  });

  server.del('/api/polls/:id', function (req, res) {
    res.send(200, {});
  });


  // ## Questions API

  server.get('/api/polls/:id/questions', function (req, res) {
    res.send(200, {});
  });

  server.post('/api/polls/:id', function (req, res) {
    res.send(200, {});
  });

  server.get('/api/polls/:pId/questions/:qId', function (req, res) {
    res.send(200, {});
  });


  // ## Answers API

  server.get('/api/polls/:pId/questions/:qId/answers', function (req, res) {
    res.send(200, {});
  });

  server.get('/api/polls/:pId/questions/:qId/answers/:aId', function (req, res) {
    res.send(200, {});
  });


  // ## Votes API

  server.get('/api/polls/:pId/questions/:qId/answers/:aId/votes', function (req, res) {
    res.send(200, {});
  });
};