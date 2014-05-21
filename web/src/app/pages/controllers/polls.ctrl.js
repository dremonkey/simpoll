'use strict';

angular.module('dapoll.pages.controllers')

  .controller('PollCreateCtrl', function ($scope, geolocation, $_polls, $state) {

    var submit = function () {
      var poll = {};

      // Create the Poll
      poll.name = $scope.poll.name;
      poll.lat = $scope.coords.lat;
      poll.lon = $scope.coords.lon;

      $_polls.create(poll).then(function (res) {
        
        console.log(res);
        
        // send to the edit page
        $state.go('admin.poll', {id: res.code});

      });
    };

    // ## Get Location
    geolocation.getLocation().then(function(data){
      $scope.coords.lat = data.coords.latitude
      $scope.coords.lon = data.coords.longitude;
      $scope.coords.acc = data.coords.accuracy;

      console.log($scope.coords);
    });

    // ## Setup Scope Variables
    $scope.poll = {};
    $scope.coords = {};
    $scope.submit = submit;
  })

  .controller('PollsCtrl', function ($scope, $_polls, $state, geolocation) {
    $_polls.all().then(function (polls) {
      $scope.polls = polls;
    });

    // ## Get Location
    geolocation.getLocation().then(function(data){
      $scope.coords.lat = data.coords.latitude
      $scope.coords.lon = data.coords.longitude;
      $scope.coords.acc = data.coords.accuracy;

      console.log('Current Location', $scope.coords);
    });


    // ## Setup Scope Variables
    $scope.polls = [];
    $scope.coords = {};
    $scope.isAdmin = $state.includes('admin');
  })

  .controller('PollCtrl', function (_, $scope, $state, $stateParams, $_polls, $_questions) {

    // ## Local Variables
    var code = $stateParams.id;
    var saved = [];
    
    var punctuation = {
      question: /(.+\?)/gi,
      page: /-{5,}/gi,
      answer: /(:{2}(.+)(?=::))|(:{2}(.+))/gi
    };

    // Returns a merged array. 
    // Merges new question data with the saved question object
    // Alters the original (saved) array of data, removing merged items
    //
    // @NOTE
    // This is not safe when deleting from anything but the bottom of the
    // questions. I need to figure out a way to determine which of the original
    // items was deleted. Probably need to set up a watch callback to track
    // changes
    // var merge = function (oldArr, newDataArr) {
      
    //   var merged = []; // array of objects to return

    //   for (var i = 0; i < newDataArr.length; i++) {
    //     merged[i] = oldArr[i] || {};
    //     merged[i]['content'] = newDataArr[i];
    //   };

    //   return merged;
    // };


    var parseText = function (text) {
      var parsed;
      var pairs = text.split(punctuation.page);

      parsed = _.map(pairs, function (pair) {
        var question = {content: pair.match(punctuation.question)[0]};
        var answers = _.map(pair.match(punctuation.answer), function (answer) {
          return {content: answer.slice(2), display: true};
        });

        // if there are no answers, default to yes and no but set display to false
        if (answers.length === 0) {
          answers.push(
            {content: 'yes', display: false}, 
            {content: 'no', display: false}
          );
        }

        return {question: question, answers: answers};
      });

      return parsed;
    };

    var stringifyQAPairs = function (pairs) {

      var result = _.map(pairs, function (pair) {
        var string = pair.question.content+'\n';

        // add the answers
        string += _.reduce(pair.answers, function (string, answer) {
          
          if (answer.display) {
            return string + '::' + answer.content;
          } 

          return '';

        }, '');

        console.log(string);
        return string;
      });

      return result.join('\n----------\n');
    };

    // Save the questions
    var submit = function () {

      // Parse Questions Text
      // var questions = $scope.poll.qaPairs.split(punctuation.page);

      var parsed = parseText($scope.poll.body);

      
      // @TODO need to do merging, saving, and deleting
      // merge saved with new questions based on index

      // var merged = merge(saved, questions);

      // at this point anything left in 'saved' needs to be deleted
      // var deleted = saved.splice(merged.length);

      // $_questions.createOrUpdate(code, merged);

      var data = {
        name: $scope.poll.name,
        qaPairs: parsed
      }

      $_polls.update(code, data);

      // if (deleted.length) {
      //   $_questions.remove(code, deleted);
      // }
    }


    // Delete the poll
    var deletePoll = function () {
      $_polls.remove(code).then(function () {
        $state.go('admin.polls');
      });
    };


    // ## Get existing poll and question/answer pairs
    $_polls.get(code).then(function (res) {
      $scope.poll.name = res[0].name;
      $scope.poll.body = stringifyQAPairs(res[0].qaPairs);
    });


    // ## Setup Scope Variables
    $scope.poll = {};
    $scope.submit = submit;
    $scope.deletePoll = deletePoll;
  })

  .controller('PollVotingCtrl', function ($scope, $_polls, $stateParams, $_answers) {

    var code = $stateParams.id;
    
    // ## Get Question/Answer Pairs
    $_polls.get(code).then(function (res) {
      $scope.poll = res[0];
      $scope.qas = res[0].qaPairs;
    });

    var vote = function (answer) {
      var data = {};

      data.pollId = $scope.poll._id;
      data.answer = answer;
      
      $_answers.upVote(data).then(function () {
        console.log('go to next question');
      });
    };

    // ## Setup Scope Variables
    $scope.qas = {};
    $scope.poll = {};
    $scope.vote = vote;
  })

  .controller('PollResultsCtrl', function (_, $scope, $_polls, $stateParams, $_socketio) {

    var code = $stateParams.id;
    
    // ## Get Question/Answer Pairs
    $_polls.get(code).then(function (res) {
      $scope.poll = res[0];
      $scope.qas = res[0].qaPairs;
    });

    $_socketio.on('vote:change', function (data) {
      var answer = data.answer; // updated answer data

      // update scope
      _.each($scope.qas, function (qa) {
        if (qa.question._id === answer.question_id) {
          _.each(qa.answers, function (ans, index) {
            if (ans._id === answer._id) {
              qa.answers[index] = answer;
            }
          });
        }
      });

      $scope.$digest();
    });

    // ## Setup Scope Variables
    $scope.qas = {};
    $scope.poll = {};
  });;
