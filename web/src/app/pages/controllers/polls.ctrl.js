'use strict';

angular.module('dapoll.pages.controllers')
  .controller('PollsCtrl', function ($scope, geolocation) {

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
      poll.name = $scope.polls.name;
      poll.lat = $scope.coords.lat;
      poll.lon = $scope.coords.lon;

      // Create each of the questions

      // Create answers
    };

    // ## Parse Body
    $scope.$watch('polls.body', function (newText, oldText) {
      // console.log(newText, '\n\n' + oldText);

      if (newText) {
        pages = newText.split(punctuation.page);
      }
    });

    // ## Get Location
    geolocation.getLocation().then(function(data){
      $scope.coords.lat = data.coords.latitude
      $scope.coords.lon = data.coords.longitude;
      $scope.coords.acc = data.coords.accuracy;

      console.log($scope.coords);
    });

    // ## Setup Scope Variables
    $scope.polls = {};
    $scope.coords = {};
    $scope.submit = submit;
  });