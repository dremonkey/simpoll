'use strict';

angular.module('dapoll.pages', [
  'dapoll.pages.controllers',
  'dapoll.pages.directives',
  'dapoll.pages.services',
  'geolocation',
  'ngResource',
  'ui.router.compat'
]);

angular.module('dapoll.pages')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'pages/templates/home.tpl.html',
        controller: 'HomeCtrl',
        data: {
          bodyId: 'home'
        }
      })

      .state('polls', {
        url: '/polls',
        templateUrl: 'pages/templates/list.tpl.html',
        controller: 'PollsCtrl',
        data: {
          bodyId: 'polls'
        }
      })

      .state('poll', {
        url: '/polls/:id',
        templateUrl: 'pages/templates/poll.tpl.html',
        controller: 'PollCtrl',
        data: {
          bodyId: 'poll'
        }
      })

      .state('create', {
        url: '/create',
        templateUrl: 'pages/templates/create.tpl.html',
        controller: 'HomeCtrl',
        data: {
          bodyId: 'polls',
          bodyClasses: 'polls-new',
        }
      });
  });

angular.module('dapoll.pages.controllers', []);
angular.module('dapoll.pages.directives', []);
angular.module('dapoll.pages.services', []);