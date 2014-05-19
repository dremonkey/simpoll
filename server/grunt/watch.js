'use strict';

module.exports = {
  express: {
    files: [
      'server.js',
      'middleware/**/*.js',
      'models/**/*.js',
      'routes/**/*.js',
      'utils/**/*.js'
    ],
    tasks:  ['express:dev']
  },
  options: {
    //Without this option the specified express won't be reloaded
    nospawn: true
  }
};