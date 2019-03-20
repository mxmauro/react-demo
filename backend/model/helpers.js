'use strict';

exports.trim = function (str)
{
	if (typeof str === 'string') {
		return str.replace(/^\s+|\s+$/gm, ''); //trim
	}
	return str;
}

exports.toNumber = function (value)
{
	if (typeof value === 'string') {
		return parseInt(value);
	}
	if (typeof value === 'number') {
		return value;
	}
	return NaN;
}

exports.buildDataTableRequest = function (req)
{
	let params = {};

	params.draw = (typeof req.body.draw === "string") ? (parseInt(req.body.draw) || 0) : 1;
	params.start = 0;
	params.count = 10;
	params.filter = "";
	params.sort = {};
	params.sort.column = -1;
	params.sort.order = "";

	if (typeof req.body.length === "string") {
		params.count = parseInt(req.body.length) || 0;
		if (params.count < 1 && params.count != -1) {
			params.count = 1;
		}
		if (params.count > 1000) {
			params.count = 1000;
		}
	}
	if (typeof req.body.start === "string") {
		params.start = parseInt(req.body.start) || 0;
		if (params.start < 0) {
			params.start = 0;
		}
	}
	if (typeof req.body["search[value]"] === "string") {
		params.filter = req.body["search[value]"];
	}
	
	if (typeof req.body["order[0][column]"] === "string") {
		params.sort.column = parseInt(req.body["order[0][column]"]) || 0;
		params.sort.order = (typeof req.body["order[0][dir]"] === "string" && req.body["order[0][dir]"] == "desc") ? " DESC" : "";
	}

	return params;
}
