'use strict';

angular.module('dapoll.pages.services')
  
  // Allows lodash to be injected
  .service('$_polls', function ($resource) {
    var actions = {get: {isArray: true}};
    var Polls = $resource('api/polls/:id', {id: '@id'}, actions);

    this.all = function () {
      return Polls.get().$promise;
    };

    this.get = function (code) {
      return Polls.get({id: code}).$promise;
    };

    this.create = function (data) {
      return Polls.save(data).$promise;
    };

    this.remove = function (code) {
      return Polls.delete({id: code}).$promise;
    };

    return this;
  });