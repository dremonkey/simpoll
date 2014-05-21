'use strict';

angular.module('dapoll.pages.services')
  
  // Allows lodash to be injected
  .service('$_socketio', function () {
    
    var socket = io.connect('http://localhost');
    
    socket.on('vote:change', function (data) {
      console.log(data);
    });

    return socket;
  });