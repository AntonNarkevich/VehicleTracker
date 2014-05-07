'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;
var jade = require('jade');
var path = require('path');
var Zip = require("adm-zip");

var rekuire = require('rekuire');
var logger = rekuire('logger');
var keys = rekuire('keys.config.json');

//TODO: Analize. When should I execute "done".
function getExportArray(done) {
	fs.mkdir(path.normalize('./temp/export'), function () {
		var exportCommand = jade.renderFile('./src/export/export.jade', keys).split('\n').join(' & ');

		var cp = spawn(process.env.comspec, ['/c', exportCommand]);

		cp.stdout.on('data', function (data) {
			//TODO: Use logger instead of console.
			console.log(data.toString());
		});

		cp.stderr.on('data', function (data) {
			console.error(data.toString());
			done(data, null);
		});

		cp.on('close', function (code) {
			console.log('exit code: ' + code);

			var archive = new Zip();

			//TODO: Is it synchronious? How can I make it async?
			archive.addLocalFolder(path.normalize("./temp/export"));
			archive.addLocalFile(path.normalize("./src/export/import.cmd"));

//		archive.writeZip("./temp/export2.zip");

			archive.toBuffer(function (buffer) {
				logger.info('Made a buffer from zip.');
				done(null, buffer);
			}, function (err) {
				logger.error('Cant make a buffer from zip.');
				done(err, null);
			});
		});
	});
}

module.exports = {
	getExportArray: getExportArray
};

