"use strict";

var express = require('express');

var auth = require('../src/auth.js');
var error = require('../src/error.js');
var user = require('../src/user.js');

var router = express.Router();

/* GET new access token. */
router.post('/', getAccessToken);

// "/token"
// requests a new token with specified parameters
//    google id token (will be validated server side)
//
// or get a token with user credentials
//    username / email
//    password
function getAccessToken(req, res, next)
{
  // body should automatically be parsed as JSON
  // TODO: how to check if invalid JSON was sent?
  var req_body = req.body;

  // try and get a valid user from the request body
  if(typeof req_body.googleIdToken !== 'undefined')
  {
    auth.validateGoogleIDToken(req_body.googleIdToken, function(valid, googleUserID)
      {
        if(!valid)
        {
          error.send(res, error.invalidToken);
          return;
        }

        generateAccessTokenForUser(user.getUserIDFromGoogleUserID(googleUserID), req, res, next);
      });
  }
  else if(typeof req_body.usernameEmail !== 'undefined' && typeof req_body.password !== 'undefined')
  {
    var userID = '';
    if(user.usernameExists(req_body.usernameEmail))
    {
      userID = req_body.usernameEmail;
    }
    else
    {
      userID = user.getUserIDFromEmail(req_body.usernameEmail);
    }

    var storedPassword = user.getStoredPassword(userID);

    if(!auth.checkPassword(req_body.password, storedPassword))
    {
      error.send(res, error.invalidCredentials);
      return;
    }

    generateAccessTokenForUser(userID, req, res, next);
  }
  else
  {
    // neither of the required parameter sets were passed so we return invalid request
    error.send(res, error.invalidRequest);
    return;
  }
}

// generates a valid access token for the passed usedID - it is assumed that the userID has already been checked and does exist
function generateAccessTokenForUser(userID, req, res, next)
{
  // if it was a valid request but no user was found we return user not found
  if(userID == '')
  {
    error.send(res, error.userNotFound);
    return;
  }

  //by default tokens last 1 hour
  var expiry = GetUnixTime() + (60 * 60);

  var token = {
    token: auth.generateAccessToken(userID, expiry),
    expires: expiry
  }

  res.setHeader('Content-Type', 'application/json');
  res.cookie('tippe.ru.token', token.token, {expires: new Date(token.expires * 1000)});
	res.send(JSON.stringify(token));
}

// returns current UTC time
function GetUnixTime()
{
  return Math.round((new Date()).getTime() / 1000);
}

module.exports = router;
