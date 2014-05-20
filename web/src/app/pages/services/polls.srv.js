'use strict';

angular.module('dapoll.pages.services')
  
  // Allows lodash to be injected
  .service('$_polls', function ($resource) {
    
    var actions = {};
    actions.get = {isArray: true};


    var Polls = $resource('api/polls/:id', {id: '@id'}, actions);

    this.all = function () {
      return Polls.get().$promise;
    };

    // Retrieves a single poll using the hash 'code'
    this.get = function (code) {
      return Polls.get({id: code}).$promise;
    };

    this.create = function (data) {
      return Polls.save(data).$promise;
    };

    // 
    this.update = function (code, data) {

      if (!code) {
        throw new Error('To update a poll you must specify a poll code');
      }

      data.id = code;
      return Polls.save(data).$promise;
    };

    this.remove = function (code) {
      return Polls.delete({id: code}).$promise;
    };

    return this;
  });