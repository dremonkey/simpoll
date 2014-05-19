'use strict';

angular.module('dapoll.pages', ['ui.router.compat', 'dapoll.pages.controllers', 'dapoll.pages.directives'])
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
        controller: 'HomeCtrl',
        data: {
          bodyId: 'polls'
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