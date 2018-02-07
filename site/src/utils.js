"use strict";

var crypto = require('crypto');

var Utils = function() {}

Utils.generateRandomString = function(length)
	{
		if(length <= 0) return '';
		return crypto.randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0,length);
	};

module.exports = Utils;
