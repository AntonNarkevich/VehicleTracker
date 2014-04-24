/**
 * Configures and exports log4js logger
 * Enables or disabled console/file logging
 * as it's specified in config.json 
 */
var rekuire = require('rekuire');
var config = rekuire('config');
var log4js = require('log4js');

log4js.clearAppenders();

if (config.isConsoleLoggingEnabled) {
	log4js.loadAppender('console');
	var consoleAppender = log4js.appenders.console();
	log4js.addAppender(consoleAppender);
}

if (config.isFileLoggingEnabled) {
	log4js.loadAppender('file');
	var fileAppender = log4js.appenders.file(config.logFileName);
	log4js.addAppender(fileAppender);
}

var logger = log4js.getLogger();
logger.setLevel(config.logLevel);

module.exports = logger;