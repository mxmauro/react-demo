'use strict';

const path = require('path');

exports.load = async function ()
{
	let config;

	try {
		config = require(__dirname + path.sep + '..' + path.sep + 'config.js');
	}
	catch (err) {
		if (err.code === 'ENOENT') {
			throw new Error('Missing server settings.');
		}
		throw err;
	}

	if (typeof config.webserver !== 'object') {
		throw new Error('Missing web server settings.');
	}
	//----
	if (typeof config.webserver.port === 'undefined') {
		config.webserver.port = 3200;
	}
	else if (typeof config.webserver.port !== 'number' || (config.webserver.port % 1) != 0 || config.webserver.port < 1 || config.webserver.port > 65535) {
		throw new Error('Invalid web server port number.');
	}

	//--------

	if (typeof config.database !== 'object') {
		throw new Error('Missing database settings.');
	}
	//----
	if (typeof config.database.host !== 'string' || config.database.host.length == 0) {
		throw new Error('Invalid database host.');
	}
	//----
	if (typeof config.database.port === 'undefined') {
		config.database.port = 3306;
	}
	else if (typeof config.database.port !== 'number' || (config.database.port % 1) != 0 || config.database.port < 1 || config.database.port > 65535) {
		throw new Error('Invalid database port number.');
	}
	//----
	if (typeof config.database.username !== 'string' || config.database.username.length == 0) {
		throw new Error('Invalid database username.');
	}
	//----
	if (typeof config.database.password !== 'string' || config.database.password.length == 0) {
		throw new Error('Invalid database password.');
	}

	global.config = config;
}
