'use strict';

angular.module('dapoll.pages.directives')

  .directive('home', function () {
    var def = {};
    
    def = {
      priority: 10,
      link: function () {}
    };

    return def;
  });