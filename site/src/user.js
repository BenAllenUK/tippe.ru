"use strict";

var auth = require('./auth.js');
var utils = require('./utils.js');
let db = require('sqlite');

const dbPromise = Promise.resolve()
	.then(() => db.open('./database.db', { Promise }));

var User = function() {}

// returns the user ID for the passed google ID token or an empty string if the user does not exist
User.getUserIDFromGoogleUserID = function(googleUserID)
  {
    return new Promise(function(resolve, reject) {
      dbPromise.then((db) => {
    		db.get(`SELECT User.id FROM User WHERE User.googleUserID='${googleUserID}' LIMIT 1`).then(row => {
			    resolve(row.id);
    		}).catch((err) => {
					resolve(-1);
				});
      });
    });
  };

// returns the password hash stored in the database for this user
User.getStoredPassword = function(userID)
  {
		console.log(userID);
    return new Promise(function(resolve, reject) {
			db.get(`SELECT User.id, User.password, User.salt FROM User WHERE User.id=${userID} LIMIT 1`).then(row => {
    		resolve({val: row.password, salt: row.salt});
			}).catch(err => {
				console.log(err);
				resolve({val: '', salt: ''});
			});
    });
  };

//returns a userID when passed a user's email or returns an empty string if that email is not in use
User.getUserIDFromUsernameEmail = function(usernameEmail)
  {
		return new Promise(function(resolve, reject) {
			db.get(`SELECT User.id FROM User WHERE User.email='${usernameEmail}' OR User.name='${usernameEmail}' LIMIT 1`).then(row => {
				resolve(row.id);
			}).catch(err => {
				resolve(-1);
			});
		});
  };


/**
 * Adds a user to the database and returns the generated user ID
 * @param email
 * @param username
 * @param password (optional if googleUserID passed)
 * @param googleUserID (optional if password passed)
 */
User.addUser = function(email, username, password, googleUserID)
  {
		return new Promise(function(resolve, reject) {
			if((password == '' && googleUserID == '') ||
					!utils.validateEmail(email) ||
					!User.validateUsername(username)
					|| (password != '' && !auth.validatePassword(password)))
			{
				reject(new Error("Invalid parameters"));
			}

			return User.getUserIDFromUsernameEmail(username).then((id) => {
				if(id != -1)
					reject(new Error("Username exists"));
			});
		}).then(() => {
			let salt = '';
			let hashedPassword = '';

			if(password != '')
			{
				salt = utils.generateRandomString(8);
				hashedPassword = auth.hashPassword(password, salt);
			}

			return new Promise(function(resolve, reject) {
				db.run(`INSERT INTO User (name, email, googleUID, password, salt) VALUES (?, ?, ?, ?, ?);`, username, email, googleUserID, hashedPassword, salt, function(err) {
					if(err)
					{
						reject(err);
						return;
					}

					if(row != null)
					{
						resolve(this.lastID);
					}
				});
			});
		});
  };

module.exports = User;
