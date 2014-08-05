'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;
var ejs = require('ejs');
var path = require('path');
var Zip = require("adm-zip");

var rekuire = require('rekuire');
var logger = rekuire('logger');
var keys = rekuire('keys.config.json');
var config = rekuire('app.config.json');

var msSqlConfig = {
	msSqlServer: config.msSqlServer,
	msSqlInstanceName: config.msSqlInstanceName,
	msSqlUserName: keys.msSqlUserName,
	msSqlPassword: keys.msSqlPassword
};

var EXPORT_TEMPLATE_FILENAME = './src/export/export.ejs';
var IMPORT_TEMPLATE_FILENAME = './src/export/import.ejs';


//TODO: Analize. When should I execute "done".
var getExportArray = function (done) {
	fs.mkdir(path.normalize('./temp/export'), function () {
		fs.readFile(EXPORT_TEMPLATE_FILENAME, function (err, data) {
			if (err) {
				logger.error('getExportArray. Reading file: ', err);
				done(err, null);

				return;
			}

			var exportCommand = ejs.render(data.toString(), msSqlConfig)
				.split('\n')
				.join(' & ');

			logger.trace('Export script is prepared.');

			var cp = spawn(process.env.comspec, ['/c', exportCommand]);

			cp.stdout.on('data', function (data) {
				logger.trace('Export child process stdout: ' + data.toString());
			});

			cp.stderr.on('data', function (data) {
				logger.error('Export child process stderr: ' + data.toString());
				done(data, null);
			});

			cp.on('close', function (code) {
				logger.trace('Export child process close. Code: ' + code);

				var archive = new Zip();

				archive.addLocalFolder(path.normalize("./temp/export"));

				archive.toBuffer(function (buffer) {
					logger.info('Export. Made a buffer from zip.');
					done(null, buffer);
				}, function (err) {
					logger.error('Export. Cant make a buffer from zip.');
					done(err, null);
				});
			});
		});
	});
};

var getImportScript = function (done) {
	fs.readFile(IMPORT_TEMPLATE_FILENAME, function (err, data) {
		if (err) {
			logger.error('getImportScript: ', err);
			done(err, null);

			return;
		}

		var importCommand = ejs.render(data.toString(), msSqlConfig)
			.split('\n')
			.join(' & ');

		done(null, importCommand);
	});
};

module.exports = {
	getExportArray: getExportArray,
	getImportScript: getImportScript
};

