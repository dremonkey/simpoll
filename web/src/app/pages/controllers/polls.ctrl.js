'use strict';

angular.module('dapoll.pages.controllers')

  .controller('PollCreateCtrl', function ($scope, geolocation, $_polls) {

    // ## Local Variables
    var questions = []; // array to hold the poll questions
    var punctuation = {
      page: /-{5,}/gi
    };

    var cleanText = function (arr) {
      for (var i = arr.length - 1; i >= 0; i--) {
        arr[i] = arr[i].trim();
      };

      return arr;
    };

    var submit = function () {
      var poll = {};

      // Create the Poll
      poll.name = $scope.poll.name;
      poll.lat = $scope.coords.lat;
      poll.lon = $scope.coords.lon;

      $_polls.create(poll).then(function (res) {
        $scope.poll.id = res._id;
        $scope.poll.code = res.code;

        console.log(res);
        // send to the edit page
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

  .controller('PollCtrl', function ($scope, $stateParams) {
    
    // ## Parse Body
    $scope.$watch('poll.body', function (newText, oldText) {
      // console.log(newText, '\n\n' + oldText);

      if (newText) {
        pages = newText.split(punctuation.page);
      }
    });

    // ## Setup Scope Variables
    $scope.poll = {};
    $scope.poll.id = $stateParams.id;
  });