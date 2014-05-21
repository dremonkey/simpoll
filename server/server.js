'use strict';

// ## Module dependencies
var express = require('express')
  , http = require('http')
  , io = require('socket.io');

var Config = require('./config/index.js')
  , log = require('./utils/logger')
  , middleware = require('./middleware')
  , routes = require('./app/routes')
  , sockets = require('./sockets');

var cfg = new Config().getSync();

// Initializes the server
var server = express();

log.info('Using configurations for ' + process.env.NODE_ENV);
log.info('Configurations loaded... initializing the server');

// ## Middlesware
middleware(server, cfg);

// ## Initialize Routes
routes.api(server, cfg);

// Forward remaining requests to index
server.all('/*', function (req, res) {
  res.sendfile('index.html', {root: server.get('views')});
});

// Start the server
server.set('port', cfg.server.port);
var instance = http.createServer(server).listen(server.get('port'), function () {
  log.info('Express server listening on port ' + server.get('port'));
});

// Hook up Socket
io = io.listen(instance);
sockets(io);
server.io = io;

module.exports = server;