'use strict';

exports.throwInvalidArgument = function (parameter)
{
	var err = new Error("Invalid argument");
	err.type = 'invalid_arg';
	err.parameter = parameter;
	throw err;
}

exports.throwModifiedRecord = function ()
{
	var err = new Error("Data has been modified on another session");
	err.type = 'changed_record';
	throw err;
}

exports.throwNotFound = function ()
{
	var err = new Error("Not found");
	err.type = 'not_found';
	throw err;
}

exports.throwNotImplemented = function ()
{
	var err = new Error("Not implemented");
	err.type = 'not_impl';
	throw err;
}

exports.throwUnauthorized = function ()
{
	var err = new Error("Unauthorized");
	err.type = 'unauthorized';
	throw err;
}

exports.throwCustom = function (_code, _message, _extra)
{
	if (typeof _message === 'object' && typeof _extra === 'undefined') {
		_extra = _message;
		delete _message;
	}
	var err = new Error(_message ? _message : "Custom error");
	err.type = 'custom';
	err.code = _code;
	if (typeof _extra === 'object') {
		Object.keys(_extra).forEach(function (key) {
			err[key] = _extra[key];
		});
	}
	throw err;
}