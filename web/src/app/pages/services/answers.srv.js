'use strict';

angular.module('dapoll.pages.services')
  
  // Allows lodash to be injected
  .service('$_answers', function (_, $resource) {
    
    var Answers = $resource('api/polls/:pId/questions/:qId/answers/:aId', {pId: '@pId', qId: '@qId', aId: '@aId'});

    this.upVote = function (data) {
      var params = {};

      params.pId = data.pollId;
      params.qId = data.answer.question_id;
      params.aId = data.answer._id;
      params.vote = 'up';

      return Answers.get(params).$promise;
    };

    this.downVote = function (data) {

    };

    return this;

  });