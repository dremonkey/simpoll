'use strict';

// Module dependencies
var express = require('express')
  , http = require('http');

var Config = require('./config/index.js')
  , log = require('./utils/logger')
  , middleware = require('./middleware')
  , routes = require('./app/routes');

var config = new Config();

// Sets up the express server instance
// Instantiates the routes, middleware, and starts the http server
function init (server) {

  var _config;

  // Retrieve the configuration object
  _config = config.get();

  // ## Middleware
  middleware(server, _config);

  // ## Initialize Routes
  routes.api(server, _config);

  // Forward remaining requests to index
  server.all('/*', function (req, res) {
    res.sendfile('index.html', {root: server.get('views')});
  });

  function startServer () {
    server.set('port', _config.server.port);
    http.createServer(server).listen(server.get('port'), function () {
      log.info('Express server listening on port ' + server.get('port'));
    });
  }

  // Start the server
  startServer();
}

// Initializes the server
config.load().then(function () {
  log.info('Configurations loaded... initializing the server');
  init(express());
});