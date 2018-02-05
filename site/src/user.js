"use strict";

var auth = require('./auth.js');

var User = function() {}

// returns the user ID for the passed google ID token or an empty string if the user does not exist
User.getUserIDFromGoogleUserID = function(googleUserID)
  {
    // TODO: Query the database for a user which matches the google user ID
    return '';
  };

// returns the password hash stored in the database for this user
User.getStoredPassword = function(userID)
  {
    // TODO: Query the database for the password for this user
    return auth.hashPassword('password123');
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
    return '';
  };

// adds a user to the database and returns the generated user ID
User.addUser = function(email, username, password)
  {
    return '';
  };

module.exports = User;
