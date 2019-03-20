'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const ca_store = require('ca-store');
const ca_store_writer = require('ca-store/lib/writer');
const util = require('util');

const CA_STORE_FOLDER = 'ca_store';
const SSL_CERTS_FILENAME = 'ssl_certs.crt';
const LAST_CHECK_FILENAME = '.last_check';

exports.initialize = async function ()
{
	try {
		let rootCas = await loadCertificates();

		require('https').globalAgent.options.ca = rootCas;
	}
	catch (err) {
		await downloadCertificates();
	}
}

async function loadCertificates()
{
	let sslCertsFilename = path.resolve(__dirname, '../' + CA_STORE_FOLDER + '/' + SSL_CERTS_FILENAME);
	let lastCheckFilename = path.resolve(__dirname, '../' + CA_STORE_FOLDER + '/' + LAST_CHECK_FILENAME);

	const lstatAsync = util.promisify(fs.lstat);
	const readFileAsync = util.promisify(fs.readFile);

	await lstatAsync(sslCertsFilename);

	let contents = await readFileAsync(lastCheckFilename);
	contents = JSON.parse(contents);

	//if less than a week passed, try to load the file
	if (moment.utc() >= moment(contents.lastUpdate).add(1, 'weeks')) {
		throw new Error("Outdated file");
	}

	//try to load the file
	return await ca_store.loadAsync(sslCertsFilename);
}

async function downloadCertificates()
{
	let rootCas = await ca_store.download({ raw: true });

	await saveCertificates(rootCas);

	return rootCas.map(function(cert) {
		return cert.PEM();
	});
}

async function saveCertificates(rootCas)
{
	let caStoreFolder = path.resolve(__dirname, '../' + CA_STORE_FOLDER);
	let sslCertsFilename = path.resolve(__dirname, '../' + CA_STORE_FOLDER + '/' + SSL_CERTS_FILENAME);
	let lastCheckFilename = path.resolve(__dirname, '../' + CA_STORE_FOLDER + '/' + LAST_CHECK_FILENAME);

	try {
		mkdirRecursiveSync(caStoreFolder);
	}
	catch (err) {
		reject(err);
		return;
	}
	const writeFileAsync = util.promisify(fs.writeFile);

	//write certificates
	await ca_store_writer.writeExports(rootCas, sslCertsFilename);

	//write last check file
	await writeFileAsync(lastCheckFilename, JSON.stringify({
		lastUpdate: moment.utc().toDate()
	}), 'utf8');
}

function mkdirRecursiveSync(dir)
{
	var chunks = path.normalize(dir).split(path.sep);
	var currPath = '';

	currPath = chunks[0] + path.sep;
	chunks.shift();

	if (chunks[chunks.length - 1] === '') {
		chunks.pop();
	}

	for (let i = 0; i < chunks.length; i++) {
		currPath += chunks[i] + path.sep;
		if (!fs.existsSync(currPath)) {
			fs.mkdirSync(currPath);
		}
	}
}
