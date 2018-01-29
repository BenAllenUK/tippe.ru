"use strict";

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
    return '';
  };

module.exports = User;
