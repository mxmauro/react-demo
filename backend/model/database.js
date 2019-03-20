'use strict';

const util = require('util');
const mysql = require('mysql');

exports.connect = async function (useDB)
{
	if (typeof useDB === 'undefined') {
		useDB = true;
	}

	let opts = {
		host: config.database.host,
		port: config.database.port,
		user: config.database.username,
		password: config.database.password
	};
	if (useDB) {
		opts.database = 'reactdemo_backend';
	}
	let conn = mysql.createConnection(opts);

	await util.promisify(conn.connect);

	//override some methods
	conn.queryAsync = util.promisify(conn.query);

	conn.changeUserAsync = util.promisify(conn.changeUser);

	//append some methods
	conn.selectDatabaseAsync = async function () {
		await this.changeUser({
			database : 'reactdemo_backend'
		});
	};

	//done
	return conn;
}

exports.initialize = async function ()
{
	let conn = await exports.connect(false);
	try {
		await conn.selectDatabaseAsync();

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		if (err.errno === 1049) { //ER_BAD_DB_ERROR
			try {
				await createDatabase();
			}
			catch (err) {
				err.message = "Error while creating database: " + err.message;
				throw err;
			}
		}
		else {
			err.message = "Error while checking database: " + err.message;
			throw err;
		}
	}
}

exports.isDuplicateKeyError = function (err)
{
	return (typeof err === 'object' && typeof err.code === 'string' && err.code == "23505") ? true : false;
}

exports.isConstraintViolationError = function (err)
{
	return (typeof err === 'object' && typeof err.code === 'string' &&
	        (err.code == "23000" || err.code == "23001" || err.code == "23002" || err.code == "23003" || err.code == "23514")) ? true : false;
}

//------------------------------------------------------------------------------

async function createDatabase()
{
	let conn = exports.connect(false);
	try {
		await conn.queryAsync('CREATE DATABASE `reactdemo_backend` DEFAULT CHARACTER SET utf8;');

		await conn.selectDatabaseAsync();

		await conn.queryAsync('SET FOREIGN_KEY_CHECKS=0;');

		//Table structure for employees
		await conn.queryAsync('DROP TABLE IF EXISTS `users`;');
		await conn.queryAsync('CREATE TABLE `users` (\n' + 
								'`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n' +
								'`username` varchar(80) NOT NULL,\n' +
								'`password` char(64) NOT NULL,\n' +
								'`last_modification` datetime NOT NULL,\n' +
								'PRIMARY KEY (`id`),\n' +
								'KEY `k_users_name` (`name`)\n' +
							') ENGINE=InnoDB DEFAULT CHARSET=utf8;\n');

		await conn.queryAsync('INSERT INTO `users` VALUES (?, ?, NOW()));', [
			'mxmauro', '2961c5a0feb2a8c962decf37230d10a42a74a0b8ca7a38bd0a596f751157845a'
		]);

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}
}
