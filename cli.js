#!/usr/bin/env node

var fs = require('fs-extra');
var mustache = require('mustache');
var path = require('path');
var colors = require('colors');
var config = require('./config');
var program = require('commander');

/**
 * Client arguments.
 */
 
program
  .version('0.0.1')
  .option('-p','--port [type]', 'Custom port for the server', null)
  .parse(process.argv);
	
/**
 * Starting a server.
 */
 
var indexPath = path.join(process.cwd(), 'index.js');

fs.exists(indexPath, function (exists) {
	if(exists) {
		require(indexPath);
	}
	else {
		var server = require('./');
		if(program.port) {
			server.listen(program.port);
		}
		else {
			server.listen();
		}
	}
});