/**
 * Configures and exports logger.
 * Category "[default]".
 * Other categories are ignored.
 */
'use strict';

var rekuire = require('rekuire');

var config = rekuire('app.config');
var log4jsConfig = rekuire('log4js.config');
var log4js = require('log4js');

log4js.clearAppenders();
log4js.configure(log4jsConfig);

module.exports = log4js.getLogger();