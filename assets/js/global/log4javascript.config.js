/*global log4javascript, VT*/
(function logConfig(global) {
	'use strict';

	var LOG_LEVEL = log4javascript.Level.ALL;

	var logger = log4javascript.getLogger();
	var appender = new log4javascript.BrowserConsoleAppender();

	logger.addAppender(appender);

	(function doExport() {
		global.VT = global.VT || {};

		VT.logger = logger;
		VT.logger.info('log4javascript logger is configured. Log level: ', LOG_LEVEL.name);
	}());
}(this));