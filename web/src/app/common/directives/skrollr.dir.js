'use strict';

/**
 * Attach to any element that needs the skrollr functionality
 */

angular.module('dapoll.common.directives.skrollr', [])
  .directive('skrollr', function () {

    var _skrollr = skrollr.get();

    // Helper function to recursively traverse an element and extract all child nodes
    function getNodes(el, elements) {
      elements = elements || [];
      elements.push(el);
      var children = el.childNodes;
      for (var i=0; i < children.length; i++) {
        if (children[i].nodeType === 1) {
          elements = getNodes(children[i], elements);
        }
      }
      return elements;
    }
    
    var directiveDefinitionObject = {
      link: function (scope, element) {
        if ('undefined' === typeof(_skrollr)) {
          _skrollr = skrollr.init();
        }
        else {
          var elements = getNodes(element[0]);
          _skrollr.refresh(elements);
        }
      }
    };

    return directiveDefinitionObject;
  });