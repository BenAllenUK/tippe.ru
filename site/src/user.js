"use strict";

var auth = require('./auth.js');
let db = require('sqlite');

const dbPromise = Promise.resolve()
	.then(() => db.open('./database.db', { Promise }));

var User = function() {}

// returns the user ID for the passed google ID token or an empty string if the user does not exist
User.getUserIDFromGoogleUserID = function(googleUserID)
  {
    return new Promise(function(resolve, reject) {
      dbPromise.then((db) => {
    		db.get(`SELECT * FROM User WHERE User.googleUID='${googleUserID}' LIMIT 1`).then((err,row) => {
          if(err)
          {
            reject(err);
          }
          else
          {
            if(row != null)
            {
      			   resolve(row.id);
            }
            else
            {
              resolve('');
            }
          }
    		});
      });
    });
  };

// returns the password hash stored in the database for this user
User.getStoredPassword = function(userID)
  {
    // TODO: Query the database for the password for this user
    return new Promise(function(resolve, reject) {
      //resolve(auth.hashPassword('password123', 'somesalt'), 'somesalt');
      resolve({val: auth.hashPassword('password123', 'somesalt'), salt: 'somesalt'});
    });
  };

//returns true if there is a user with this username
User.usernameExists = function(userID)
  {
    // TODO: Query the database
    return userID === 'test';
  };

//returns a userID when passed a user's email or returns an empty string if that email is not in use
User.getUserIDFromEmail = function(email)
  {
    // TODO: Query the database
    return Promise.resolve('test');
  };

// adds a user to the database and returns the generated user ID
User.addUser = function(email, username, password)
  {
    return Promise.resolve('');
  };

module.exports = User;
