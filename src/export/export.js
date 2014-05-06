'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;
var jade = require('jade');
var path = require('path');
var Zip = require("adm-zip");

var rekuire = require('rekuire');
var logger = rekuire('logger');
var keys = rekuire('keys.config.json');

fs.mkdir(path.normalize('./temp/export'), function() {
	var exportCommand = jade.renderFile('./src/export/export.jade', keys).split('\n').join(' & ');

	var cp = spawn(process.env.comspec, ['/c', exportCommand]);

	cp.stdout.on('data', function (data) {
		console.log(data.toString());
	});

	cp.stderr.on('data', function (data) {
		console.error(data.toString());
	});

	cp.on('close', function (code) {
		console.log('exit code: ' + code);


	});
});

