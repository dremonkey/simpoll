'use strict';

angular.module('dapoll.pages.services')
  
  // Allows lodash to be injected
  .service('$_questions', function (_, $resource) {
    
    var actions = {get: {isArray: true}};
    var Questions = $resource('api/polls/:id/questions', {id: '@id'}, actions);

    this.get = function (code) {
      return Questions.get({id: code}).$promise;
    };

    this.createOrUpdate = function (id, questions) {
      var data = {};
      
      data.id = id;
      data.questions = questions;

      return Questions.save(data).$promise;
    };

    this.remove = function (id, questions) {
      var data = {};
      
      data.id = id;

      console.log(id, questions);
      
      // Pull questions ids out
      data.ids = _.map(questions, function (question) {
        console.log(question);
        return question._id;
      });

      
      return Questions.delete(data).$promise;
    };

    return this;
  });