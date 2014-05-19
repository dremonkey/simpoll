'use strict';

angular.module('dapoll.pages.services')
  
  // Allows lodash to be injected
  .service('$_polls', function ($resource) {
    var actions = {get: {isArray: true}};
    var Polls = $resource('api/polls/:id', {id: '@id'}, actions);

    this.all = function () {
      return Polls.get().$promise;
    };

    this.one = function (id) {
      return Polls.get({id: id}).$promise;
    };

    this.create = function (data) {
      return Polls.save(data).$promise;
    };

    return this;
  });