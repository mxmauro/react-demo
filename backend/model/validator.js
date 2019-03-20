'use strict';

exports.isEmpty = function (str)
{
	return (str.length == 0) ? true : false;
}

exports.checkLength = function (str, min, max)
{
	return (str.length < min || str.length > max) ? false : true;
}

exports.isNumber = function (value)
{
	return (isNaN(value) || !(typeof value === 'number' && value % 1 === 0)) ? false : true;
}

exports.isString = function (value)
{
	return (typeof value === 'string');
}

exports.isId = function (_id, canBeZero) {
	if ((!exports.isNumber(_id)) || _id == NaN || _id < 0)
		return false;
	return (canBeZero || _id > 0) ? true : false;
}

exports.isValidEMail = function (email, canBeEmpty, maxLength)
{
	let lastWasDot = false;
	let i, atPos = -1;

	if (!exports.isString(email)) {
		return false;
	}
	if (email.length == 0) {
		return canBeEmpty ? true : false;
	}
	if (maxLength && email.length > maxLength) {
		return false;
	}

	for (i = 0; i < email.length; i++) {
		if (email.charCodeAt(i) <= 32) {
			return false;
		}
		switch (email.charAt(i)) {
			case '.':
				if (lastWasDot != false || atPos == i - 1) {
					return false;
				}
				lastWasDot = true;
				break;

			case '@':
				if (i == 0 || lastWasDot != false || atPos >= 0) {
					return false;
				}
				atPos = i;
				lastWasDot = false;
				break;

			case '(':
			case ')':
			case '<':
			case '>':
			case ',':
			case ';':
			case ':':
			case '\\':
			case '/':
			case '"':
			case '[':
			case ']':
				return false;

			default:
				lastWasDot = false;
				break;
		}
	}
	if (lastWasDot != false || atPos < 0 || atPos == email.length - 1) {
		return false;
	}
	return true;
}

exports.isValidPhone = function (phone, canBeEmpty, maxLength)
{
	var i, ch, lastCh, openParenthesis = false, digitCount = 0;

	if (!exports.isString(phone)) {
		return false;
	}
	if (phone.length == 0) {
		return canBeEmpty ? true : false;
	}
	if (maxLength && phone.length > maxLength) {
		return false;
	}

	for (i = 0; i < phone.length; i++) {
		ch = phone.charAt(i);
		if (ch == '+') {
			if (i > 0) {
				return false;
			}
		}
		else if (ch == '(') {
			if (openParenthesis || lastCh == '+') {
				return false;
			}
		}
		else if (ch == ')') {
			if ((!openParenthesis) || lastCh < '0' || lastCh > '9') {
				return false;
			}
		}
		else if (ch == '-') {
			if (lastCh < '0' || lastCh > '9') {
				return false;
			}
		}
		else if (ch >= '0' && ch <= '9') {
			digitCount++;
		}
		else {
			return false;
		}
		lastCh = ch;
	}
	return (digitCount >= 6) ? true : false;
}

exports.isValidColor = function (color)
{
	if (!exports.isString(color)) {
		return false;
	}
	return /^[A-Fa-f0-9]{6}$/.test(color);
}

exports.checkTimestamp = function (str)
{
	if (!(exports.isString(str) || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str))) {
		return false;
	}
	return true;
}

exports.checkPassword = function (str)
{
	if (!(exports.isString(str) || /^[0-9A-Fa-f]{64}$/.test(str))) {
		return false;
	}
	return true;
}

exports.checkCode = function (str)
{
	if (!(exports.isString(str) || /^[0-9A-Fa-f]{40}$/.test(str))) {
		return false;
	}
	return true;
}
