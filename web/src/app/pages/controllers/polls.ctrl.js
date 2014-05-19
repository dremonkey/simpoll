'use strict';

angular.module('dapoll.pages.controllers')
  .controller('PollsCtrl', function ($scope, geolocation) {
    geolocation.getLocation().then(function(data){
      $scope.coords.lat = data.coords.latitude
      $scope.coords.long = data.coords.longitude;
      $scope.coords.acc = data.coords.accuracy;

      console.log($scope.coords);
    });

    // ## Scope Variables
    $scope.coords = {};
  });