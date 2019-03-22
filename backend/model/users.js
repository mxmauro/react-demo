'use strict';
const AccessToken = require('./access_token');
const Database = require('./database.js');
const CR = require('./common_responses.js');
const Helpers = require('./helpers.js');
const Validator = require('./validator.js');
const Errors = require('./errors.js');
/*
const Privileges = require('./privileges.js');
const jsSHA = require('./js_sha.js');
const Entities = require('html-entities').AllHtmlEntities;
const crypto = require('crypto');
const moment = require('moment');
*/

exports.login = async function (req, res)
{
	let conn;

	try {
		let info;

		if (!Validator.isString(req.body.name)) {
			Errors.throwInvalidArgument();
		}
		let _name = Helpers.trim(req.body.name);
		//----
		if (!Validator.checkPassword(req.body.password)) {
			Errors.throwInvalidArgument();
		}
		let _password = req.body.password.toUpperCase();

		conn = await Database.connect();

		if (_name != 'admin') {
			let result = await conn.queryAsync('SELECT `id`,`name`,`password` FROM `users` WHERE `name` = ?', [
				_name
			]);
			if (result.length == 0) {
				Errors.throwUnauthorized();
			}
			if (result[0].name != _name || _password != result[0].password.toUpperCase()) {
				Errors.throwUnauthorized();
			}

			info = {
				id: result[0].id,
				name: result[0].name
			};
		}
		else {
			if (_password != '8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918') { //admin
				Errors.throwUnauthorized();
			}
	
			//no user must be registered in order to the 'admin' user to work
			let result = await conn.queryAsync('SELECT COUNT(*) AS `count` FROM `users`');
			if (result[0].count > 0) {
				Errors.throwUnauthorized();
			}

			info = {
				id: -1,
				name: 'Administrator'
			};
		}
		
		conn.end();
		conn = null;

		AccessToken.setAccessToken(res, info.id);
		CR.sendOk(res, info);
	}
	catch (err) {
		if (conn)
			conn.destroy();

		AccessToken.clearAccessToken(res);
		CR.sendAutoError(res, err);
	}
}

/*
exports.getConfirmationEmailInfo = async function (_id)
{
	let info;

	_id = Helpers.toNumber(_id);
	if (!Validator.isId(_id, true)) {
		Errors.throwInvalidArgument();
	}

	let conn = await Database.connect();

	try {
		let res = await conn.query('SELECT `email`,`name`,`confirmation_date`,`email_confirmation_code` FROM `employees` WHERE `id` = ?', [
			_id
		]);
		if (res.length == 0) {
			Errors.throwNotFound();
		}

		if (res[0].confirmation_date) {
			Errors.throwCustom('already_activated');
		}

		info = {
			id: _id,
			name: res[0].name,
			email: res[0].email,
			confirmation_code: res[0].email_confirmation_code
		};

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}

	return info;
}

exports.confirmEmail = async function (_confirmation_code) {
	if (!Validator.checkCode(_confirmation_code)) {
		throw new Error('invalid_code');
	}

	let conn = await Database.connect();

	try {
		let res = await conn.query('UPDATE `employees` SET `confirmation_date` = UTC_TIMESTAMP() ' +
									'WHERE `email_confirmation_code` = ? AND `confirmation_date` IS NULL;', [
			_confirmation_code.toUpperCase()
		]);
		if (res.affectedRows == 0) {
			res = await conn.query('SELECT `confirmation_date` FROM `employees` ' +
									'WHERE `email_confirmation_code` = ?;', [
				_confirmation_code.toUpperCase()
			]);
			if (res.length > 0 && res[0].confirmation_date !== null) {
				throw new Error('already_active');
			}

			throw new Error('invalid_code');
		}

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}
}

exports.changePassword = async function (_id, _old_password, _password, _last_modif)
{
	_id = Helpers.toNumber(_id);
	if (!Validator.isId(_id, true)) {
		Errors.throwInvalidArgument();
	}
	//----
	if (!Validator.checkPassword(_old_password)) {
		Errors.throwInvalidArgument();
	}
	//----
	if (!Validator.checkPassword(_password)) {
		Errors.throwInvalidArgument();
	}
	//----
	if (!Validator.checkTimestamp(_last_modif)) {
		Errors.throwInvalidArgument();
	}

	let conn = await Database.connect();

	try {
		let res = await conn.query('UPDATE `employees` SET `password` = ?, `last_modification` = UTC_TIMESTAMP() ' +
		                           'WHERE `id` = ? AND `last_modification` = ? AND `password` = ?;', [
			_password, _id, _last_modif, _old_password
		]);

		if (res.affectedRows == 0) {
			res = await conn.query('SELECT `last_modification` FROM `employees` WHERE `id` = ?;', [
				_id
			]);
			if (res.length == 0 || moment(res[0].last_modification).format('YYYY-MM-DD HH:mm:ss') != _last_modif) {
				Errors.throwModifiedRecord();
			};
			Errors.throwCustom('old_password_mismatch');
		}

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}
}

exports.sendPasswordRecoveryEmail = async function (_email)
{
	let info = null;

	if (!Validator.isString(_email)) {
		Errors.throwInvalidArgument();
	}
	_email = Helpers.trim(_email);
	if (!Validator.isValidEMail(_email, true, 80)) {
		Errors.throwInvalidArgument();
	}

	let conn = await Database.connect();

	try {
		let hashObj = new jsSHA("SHA-1", "TEXT");
		hashObj.update(_email);
		hashObj.update(crypto.randomBytes(Math.ceil(20)).toString('hex').slice(0, 40));
		let _reset_code = hashObj.getHash("HEX").toUpperCase();

		let res = await conn.query('UPDATE `employees` SET `password_recovery_code` = ?, `password_recovery_date` = UTC_TIMESTAMP(), `last_modification` = UTC_TIMESTAMP() ' +
		                           'WHERE `email` = ?;', [
			_reset_code, _email
		]);

		if (res.affectedRows == 0) {
			Errors.throwNotFound();
		}

		info = {
			email: _email,
			reset_code: _reset_code
		}

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}

	return info;
}

exports.recoverPassword = async function (_code, _password)
{
	if (!Validator.checkCode(_code)) {
		Errors.throwInvalidArgument();
	}
	//----
	if (!Validator.checkPassword(_password)) {
		Errors.throwInvalidArgument();
	}

	let conn = await Database.connect();

	try {
		let res = await conn.query('UPDATE `employees` SET `password` = ?, `last_modification` = UTC_TIMESTAMP(), `password_recovery_code` = NULL, `password_recovery_date` = NULL ' +
		                           'WHERE `password_recovery_code` = ? AND DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 HOUR) < `password_recovery_date`;', [
			_password, _code
		]);

		if (res.affectedRows == 0) {
			Errors.throwNotFound();
		}

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}
}

exports.createedit = async function (_id, _name, _email, _password, _privileges, _phone, _comments, _notifications, _last_modif, _is_admin)
{
	let info = null;

	_id = Helpers.toNumber(_id);
	if (!Validator.isId(_id, true)) {
		Errors.throwInvalidArgument();
	}
	//----
	if (!Validator.isString(_name)) {
		Errors.throwInvalidArgument();
	}
	_name = Helpers.trim(_name);
	if (!Validator.checkLength(_name, 1, 80)) {
		Errors.throwInvalidArgument();
	}
	//----
	if (!Validator.isString(_email)) {
		Errors.throwInvalidArgument();
	}
	_email = Helpers.trim(_email);
	if (!Validator.isValidEMail(_email, true, 80)) {
		Errors.throwInvalidArgument();
	}
	//----
	if (_id == 0 || _is_admin) {
		_privileges = Privileges.validate(_privileges);
		if (_privileges === false) {
			Errors.throwInvalidArgument();
		}
		_privileges = Privileges.toString(_privileges);
	}
	else {
		_privileges = null;
	}
	//----
	if (!Validator.isString(_phone)) {
		Errors.throwInvalidArgument();
	}
	_phone = Helpers.trim(_phone);
	if (!Validator.isValidPhone(_phone, true, 20)) {
		Errors.throwInvalidArgument();
	}
	//----
	if (!Validator.isString(_comments)) {
		Errors.throwInvalidArgument();
	}
	_comments = Helpers.trim(_comments);
	if (!Validator.checkLength(_comments, 0, 32768)) {
		Errors.throwInvalidArgument();
	}
	//----
	_notifications = '';
	//----
	if (_id == 0) {
		if (!Validator.checkPassword(_password)) {
			Errors.throwInvalidArgument();
		}
	}
	else {
		if (!Validator.checkTimestamp(_last_modif)) {
			Errors.throwInvalidArgument();
		}
	}

	let conn = await Database.connect();

	try {
		if (_id == 0) {
			let hashObj = new jsSHA("SHA-1", "TEXT");
			hashObj.update(_name);
			hashObj.update(_email);
			hashObj.update(_phone);
			hashObj.update(_comments);
			hashObj.update(crypto.randomBytes(Math.ceil(20)).toString('hex').slice(0, 40));
			let _confirmation_code = hashObj.getHash("HEX").toUpperCase();

			await conn.query('INSERT INTO `employees` (`name`,`email`,`password`,`privileges`,`phone`,`comments`,`notifications`,registration_date`,`confirmation_date`,`last_login_date`,' +
			                 '`email_confirmation_code`,`password_recovery_code`,`password_recovery_date`,`last_modification`) ' +
			                 'VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(), NULL, NULL, ?, NULL, NULL, UTC_TIMESTAMP());', [
				_name, _email, _password, _privileges, _phone, _comments, _notifications, _confirmation_code
			]);

			info = {
				id: _id,
				name: _name,
				email: _email,
				confirmation_code: _confirmation_code
			}
		}
		else {
			let res;

			if (_privileges) {
				res = await conn.query('UPDATE `employees` SET `name` = ? ,`email` = ?, `privileges` = ?, `phone` = ?, `comments` = ?, `notifications` = ?, `last_modification` = UTC_TIMESTAMP() ' +
				                       'WHERE `id` = ? AND `last_modification` = ?;', [
					_name, _email, _privileges, _phone, _comments, _notifications, _id, _last_modif
				]);
			}
			else {
				res = await conn.query('UPDATE `employees` SET `name` = ? ,`email` = ?, `phone` = ?, `comments` = ?, `notifications` = ?, `last_modification` = UTC_TIMESTAMP() ' +
				                       'WHERE `id` = ? AND `last_modification` = ?;', [
					_name, _email, _phone, _comments, _notifications, _id, _last_modif
				]);
			}
			if (res.affectedRows == 0) {
				Errors.throwModifiedRecord();
			}
		}

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}

	return info;
}

exports.delete = async function (_id)
{
	_id = Helpers.toNumber(_id);
	if (!Validator.isId(_id, false)) {
		Errors.throwInvalidArgument();
	}

	let conn = await Database.connect();

	try {
		let res = await conn.query('DELETE FROM `employees` WHERE `id` = ?', [
			_id
		]);
		if (res.affectedRows == 0) {
			Errors.throwModifiedRecord();
		}

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}
}

exports.get = async function (_id)
{
	let data = {};

	_id = Helpers.toNumber(_id);
	if (!Validator.isId(_id, false)) {
		Errors.throwInvalidArgument();
	}

	let conn = await Database.connect();

	try {
		let res = await conn.query('SELECT * FROM `employees` WHERE `id` = ?', [
			_id
		]);
		if (res.length == 0) {
			Errors.throwNotFound();
		}
		data = res[0];
		data.last_modification = moment(data.last_modification).format('YYYY-MM-DD HH:mm:ss');
		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}
	return data;
}

exports.getForDataTables = async function (params)
{
	let response = {};

	let conn = await Database.connect();

	try {
		let sql = 'SELECT COUNT(*) AS `total` FROM `employees`';

		let res = await conn.query(sql);
		response.recordsTotal = res[0].total;

		if (params.filter.length > 0) {
			sql = sql + " WHERE `name` LIKE '%" + conn.escape(params.filter) + "%'";
			sql = sql + " OR `email` LIKE '%" + conn.escape(params.filter) + "%'";
			res = await conn.query(sql);
		}
		response.recordsFiltered = res[0].total;

		sql = "SELECT * FROM `employees`";
		if (params.filter.length > 0) {
			sql = sql + " WHERE `name` LIKE '%" + conn.escape(params.filter) + "%'";
			sql = sql + " OR `email` LIKE '%" + conn.escape(params.filter) + "%'";
		}

		switch (params.sort.column) {
			case 0:
				sql = sql + " ORDER BY `id`" + params.sort.order;
				break;
			case 1:
				sql = sql + " ORDER BY `name`" + params.sort.order;
				break;
			case 2:
				sql = sql + " ORDER BY `email`" + params.sort.order;
				break;
		}
		sql = sql + " LIMIT " + params.count.toString();
		if (params.start > 0) {
			sql = sql + " OFFSET " + params.start.toString();
		}
		res = await conn.query(sql);

		let entities = new Entities();
		response.data = [];
		for (let idx = 0; idx < res.length; idx++) {
			var val = {};
			val[0] = res[idx].id.toString();
			val[1] = entities.encode(res[idx].name);
			val[2] = entities.encode(res[idx].email);
			val[3] = '';
			response.data[idx] = val;
		}

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}
	return response;
}

exports.getList = async function (filter)
{
	let list = [];

	if (Validator.isString(filter))
		filter = Helpers.trim(filter);
	else
		filter = '';

	let conn = await Database.connect();

	try {
		let sql = "SELECT `id`, `name` FROM `employees`";
		let args = [];
		if (filter.length > 0) {
			sql += " WHERE `name` LIKE ? ESCAPE '='";
			args.push(filter.replace('=', '==').replace('%', '=%').replace('_', '=_') + '%');
		}
		sql += " ORDER BY `name`";

		res = await conn.query(sql, args);

		let entities = new Entities();
		for (let idx = 0; idx < res.length; idx++) {
			var val = {};
			val.id = res[idx].id.toString();
			val.name = entities.encode(res[idx].name);
			list[idx] = val;
		}

		conn.destroy();
	}
	catch (err) {
		conn.destroy();

		throw err;
	}
	return list;
}
*/
