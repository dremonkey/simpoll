'use strict';

// ## Module Dependencies
// var Bookshelf = require('bookshelf');
var Config = require('../config/index.js');
var log = require('../utils/logger');
var mongoose = require('mongoose');

var cfg = new Config().getSync();
var dbconfig = cfg.db.connection;

// Initializes the database
var host = dbconfig.host + ':' + dbconfig.port + '/';
var auth = dbconfig.user + ':' + dbconfig.password;
var uri = 'mongodb://' + auth + '@' + host + dbconfig.database;

log.info('MongoDB | Connecting to ' + uri);

var conn = mongoose.connect(uri);

exports.conn = conn;
exports.mongoose = mongoose;