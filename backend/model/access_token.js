'use strict';

const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'reactdemo_access';
const PV_KEY = 'bush rally chocolate camera vat';

exports.setAccessToken = function (res, userId)
{
	let token = jwt.sign({
		userId: userId
	}, PV_KEY);

	res.cookie(COOKIE_NAME, token, { httpOnly: true });
}

exports.clearAccessToken = function (res)
{
	let token = jwt.sign({
		userId: 0
	}, PV_KEY);

	res.cookie(COOKIE_NAME, token, { httpOnly: true });
}

exports.validateAccessToken = function (req)
{
	if (typeof req.cookies !== 'undefined' && typeof req.cookies[COOKIE_NAME] === 'string') {
		try {
			let obj = jwt.verify(req.cookies[COOKIE_NAME], PV_KEY, {
				maxAge: '7 days'
			});
			if (obj.userId > 0) {
				return obj.userId;
			}
		}
		catch (err) {
		}
	}
	return -1;
}
