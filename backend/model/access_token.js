'use strict';

const jwt = require('jsonwebtoken');
const Database = require('./database.js');

const HEADER_NAME = 'x-auth';
const PV_KEY = 'bush rally chocolate camera vat';

exports.setAccessToken = function (res, userId)
{
	let token = jwt.sign({
		userId: userId
	}, PV_KEY);

	res.header(HEADER_NAME, token);
}

exports.clearAccessToken = function (res)
{
	let token = jwt.sign({
		userId: 0
	}, PV_KEY);

	res.header(HEADER_NAME, token);
}

exports.validateAccessToken = async function (req, res)
{
	if (typeof req.headers !== 'undefined' && typeof req.headers[HEADER_NAME] === 'string') {
		try {
			let obj = jwt.verify(req.headers[HEADER_NAME], PV_KEY, {
				maxAge: '7 days'
			});

			if (obj.userId == -1) { //special admin user
				let conn;

				try {
					conn = await Database.connect();
					let result = await conn.queryAsync('SELECT `id` FROM `users` WHERE `id` = ?;', [ obj.userId ]);

					conn.end();
					conn = null;

					if (result.length > 0) {
						//exports.setAccessToken(res, obj.userId);
						return obj.userId;
					}
				}
				catch (err) {
					if (conn)
						conn.destroy();
				}
			}
			else if (obj.userId > 0) {
				let conn;

				try {
					conn = await Database.connect();
					let result = await conn.queryAsync('SELECT COUNT(*) AS `count` FROM `users`;');

					conn.end();
					conn = null;

					if (result[0].count == 0) {
						//exports.setAccessToken(res, obj.userId);
						return obj.userId;
					}
				}
				catch (err) {
					if (conn)
						conn.destroy();
				}
			}
		}
		catch (err) {
		}
	}

	exports.clearAccessToken(res);
	return 0;
}
