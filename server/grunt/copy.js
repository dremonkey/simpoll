'use strict';

// var paths = require('./paths');

module.exports = {
  // Copy files from server -> heroku/server
  heroku: {
    files: [{
      expand: true,
      cwd: '<%= paths.server.tld %>',
      src: [
        'config/**/*.js',
        'utils/**/*.js',
        'middleware/**/*.js',
        'server.js'
      ],
      dest: '<%= paths.heroku.dirs.server %>'
    }]
  },

  azure: {
    files: [{
      expand: true,
      cwd: '<%= paths.server.tld %>',
      src: [
        'config/**/*.js',
        'utils/**/*.js',
        'middleware/**/*.js',
        'server.js'
      ],
      dest: '<%= paths.azure.dirs.server %>'
    }]
  }
};