"use strict";

var jwt = require('jsonwebtoken');
var { OAuth2Client } = require('google-auth-library');

var Auth = function() {}

// generates a token to send back to the user
Auth.generateAccessToken = function(userID, expires)
  {
    var payload = {
      userID: userID,
      exp: expires
    };

    return jwt.sign(payload, process.env.JWT_SECRET);
  };

//returns true if the passed JWT token is valid
Auth.validateAccessToken = function(token)
  {
    try
    {
      jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (e)
    {
      return false;
    }

    return true;
  };

// returns true if the passed JWT token is valid and is for the specified user
Auth.validateAccessTokenForUser = function(token, userID)
  {
    try
    {
      var payload = jwt.verify(token, process.env.JWT_SECRET);
      return payload.userID == userID;
    }
    catch (e)
    {
      return false;
    }
  };

//calls the passed callback with the google User ID and a boolean that is true if the token was valid
Auth.validateGoogleIDToken = function(googleIdToken, callback)
  {
    var client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, '', '');
    client.verifyIdToken({
      idToken: googleIdToken,
      audience: process.env.GOOGLE_CLIENT_ID
    }, function(e, login) {
      // callback when the verify function returns
      if(e == null)
      {
        callback(true, login.getUserId());
      }
      else
      {
        callback(false, '');
      }
    });
  };

// returns true if the query password matches the one on file
Auth.checkPassword = function(queryPassword, storedPassword)
  {
    if(!Auth.validatePassword(queryPassword)) return false;
    return Auth.hashPassword(queryPassword) == storedPassword;
  };

// returns true if the input password follows the password rules set out
Auth.validatePassword = function(password)
  {
    return password.length > 7;
  };

// returns the hash for the input password
Auth.hashPassword = function(password)
  {
    // TODO: Hash password
    return '';
  };

module.exports = Auth;
