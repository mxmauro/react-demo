'use strict';

const Database = require('./database.js');

exports.sendOk = function(res, obj)
{
	if (!obj)
		obj = {};
	obj.status = 'ok';
	res.status(200).jsonp(obj);
}

exports.sendBadRequest = function (res)
{
	res.status(400).jsonp({
		status: 'error',
		error: 'bad_request'
	});
}

exports.sendUnauthorized = function (res)
{
	res.status(401).jsonp({
		status: 'error',
		error: 'unauthorized'
	});
}

exports.sendNotImplemented = function (res)
{
	res.status(501).jsonp({
		status: 'error',
		error: 'not_impl'
	});
}

exports.sendNotFound = function(res)
{
	res.status(404).jsonp({
		status: 'error',
		error: 'not_found'
	});
}

exports.sendGenericError = function(res, error, extra)
{
	var ret = {
		status: 'error',
		error: error
	};
	if (typeof extra !== 'undefined') {
		ret.extra = extra;
	}
	res.status(400).jsonp(ret);
}

exports.sendInvalidParameter = function(res, parameter)
{
	var ret = {
		status: 'error',
		error: 'inv_param'
	};
	if (parameter) {
		ret.parameter = parameter;
	}
	res.status(400).jsonp(ret);
}

exports.sendDataTablesError = function (res, err)
{
	if (typeof err === "object") {
		if (typeof err.message !== "undefined") {
			res.set("x-message", err.message.replace(/^\s+|\s+$/gm, ''));
		}
		if (typeof err.code !== "undefined") {
			res.set("x-code", err.code.replace(/^\s+|\s+$/gm, ''));
		}
	}
	else if (typeof err !== "undefined") {
		res.set("x-message", err.toString().replace(/^\s+|\s+$/gm, ''));
	}
	res.sendStatus(500);
}

exports.sendDatabaseError = function(res, err)
{
	var ret = {
		status: 'error',
		error: 'db'
	};
	if (err) {
		if (err.code)
			ret.dberr_code = err.code;
		if (err.message)
			ret.dberr_message = err.message;
	}
	if (Database.isDuplicateKeyError(err)) {
		ret.error = 'dupl_key';
	}
	else if (Database.isConstraintViolationError(err)) {
		ret.error = 'constraint_violation';
	}
	res.status(403).jsonp(ret);
}

exports.sendInternalServerError = function(res, message)
{
	var ret = {
		status: 'error',
		error: 'internal'
	};
	if (typeof message !== 'undefined')
		ret.message = message.toString();
	res.status(500).jsonp(ret);
}

exports.sendAutoError = function(res, err)
{
	if (typeof err.type === 'string') {
		if (err.type == 'bad_request') {
			exports.sendBadRequest(res);
			return;
		}
		if (err.type == 'unauthorized') {
			exports.sendUnauthorized(res);
			return;
		}
		if (err.type == 'not_impl') {
			exports.sendNotImplemented(res);
			return;
		}
		if (err.type == 'not_found') {
			exports.sendNotFound(res);
			return;
		}
		if (err.type == 'invalid_arg') {
			exports.sendInvalidParameter(res, err.parameter);
			return;
		}
		if (err.type == 'custom') {
			var obj = {
				status: 'error',
				error: 'custom'
			}
			if (typeof err === 'object') {
				Object.keys(err).forEach(function (key) {
					if (key != 'type') {
						obj[key] = err[key];
					}
				});
			}
			res.status(403).jsonp(obj);
			return;
		}
		if (err.type == 'changed_record') {
			res.status(409).jsonp({
				status: 'error',
				error: 'changed_record'
			});
			return;
		}
	}
	if (typeof err.sqlState !== 'undefined') {
		exports.sendDatabaseError(res, err);
		return;
	}
	exports.sendInternalServerError(res, err);
}
