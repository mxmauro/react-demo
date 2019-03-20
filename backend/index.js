'use strict';

const Database = require('./model/database.js');
const Settings = require('./model/settings.js');
const Certificates = require('./model/certificates.js');
const webserver = require('./model/webserver.js');

try {
	run();
}
catch(err) {
	printError(err);
}

async function run()
{
	//load application settings
	await Settings.load();

	//load SSL certificates
	await Certificates.initialize();

	//check database
	await Database.initialize();

	//start web server
	await webserver.initialize();

	console.log("Human Resources Manager is running on http://localhost:" + config.webserver.port.toString());
}

function printError(err)
{
	console.log(err.message);
	if (err.stack) {
		console.log("\nStack trace:");
		let idx = err.stack.indexOf("\n");
		if (idx === -1)
			console.log(err.stack);
		else
			console.log(err.stack.substr(idx + 1));
	}
}