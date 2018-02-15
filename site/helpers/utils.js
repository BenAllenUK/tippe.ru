'use strict';

let crypto = require('crypto');

let Utils =  {
	generateRandomString: function(length) {
		if(length <= 0) return '';
		return crypto.randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0,length);
	},
	isValidEmail: function(email) {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	},
	isValidUsername: function(username) {
		return true
	}
};

module.exports = Utils;
