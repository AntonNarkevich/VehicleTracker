/**
 * Configures and exports logger.
 * Category is "[default]".
 * Other categories are ignored.
 */
'use strict';

var log4js = require('log4js');

var rekuire = require('rekuire');
var config = rekuire('app.config');
var log4jsConfig = rekuire('log4js.config');

log4js.clearAppenders();
log4js.configure(log4jsConfig);

module.exports = log4js.getLogger();