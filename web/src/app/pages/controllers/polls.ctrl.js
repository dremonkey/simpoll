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
        $state.go('poll', {id: res.code});

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

  .controller('PollsCtrl', function ($scope, $_polls) {
    $_polls.all().then(function (polls) {
      $scope.polls = polls;
    });


    // ## Setup Scope Variables
    $scope.polls = [];
  })

  .controller('PollCtrl', function (_, $scope, $state, $stateParams, $_polls, $_questions) {

    // ## Local Variables
    var code = $stateParams.id;
    var saved = [];
    // var questions = []; // array to hold the poll questions
    var punctuation = {
      page: /-{5,}/gi
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
    var merge = function (oldArr, newDataArr) {
      
      var merged = []; // array of objects to return

      for (var i = 0; i < newDataArr.length; i++) {
        merged[i] = oldArr[i] || {};
        merged[i]['content'] = newDataArr[i];
      };

      return merged;
    };

    var questionsToString = function (questionsArr) {
      var result = _.map(questionsArr, function (question) {
        return question.content;
      });

      return result.join('----------');
    }

    // Save the questions
    var submit = function () {

      // Parse Questions Text
      var questions = $scope.poll.questions.split(punctuation.page);

      // merge saved with new questions based on index
      var merged = merge(saved, questions);

      // at this point anything left in 'saved' needs to be deleted
      var deleted = saved.splice(merged.length);

      $_questions.createOrUpdate(code, merged);

      if (deleted.length) {
        $_questions.remove(code, deleted);
      }
    }

    // Delete the poll
    var deletePoll = function () {
      $_polls.remove(code).then(function () {
        $state.go('polls');
      });
    };

    // ## Get existing poll data
    $_polls.get(code).then(function (res) {
      console.log('Poll', res);
      $scope.poll = res[0];
    });

    // ## Get existing poll questions
    $_questions.get(code).then(function (res) {
      saved = res; // save existing questions
      $scope.poll.questions = questionsToString(res);
    });

    // ## Setup Scope Variables
    $scope.poll = {};
    $scope.submit = submit;
    $scope.deletePoll = deletePoll;
  });