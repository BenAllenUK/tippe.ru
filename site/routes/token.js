"use strict";

let express = require('express');

let auth = require('../src/auth.js');
let error = require('../src/error.js');
let user = require('../src/user.js');

let router = express.Router();

/* GET new access token. */
router.post('/', getAccessToken);

/**
 * "/token"
 * Requests a new token with specified parameters
 *  google id token (will be validated server side)
 *
 * or get a token with user credentials
 *  username / email
 *  password
 *
 * @param req
 * @param res
 * @param next
 */
function getAccessToken(req, res, next)
{
  let req_body = req.body;

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
    let userID = '';
    if(user.usernameExists(req_body.usernameEmail))
    {
      userID = req_body.usernameEmail;
    }
    else
    {
      userID = user.getUserIDFromEmail(req_body.usernameEmail);
    }

		let storedPassword = user.getStoredPassword(userID);

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
  }
}


/**
 * Generates a valid access token for the passed usedID - it is assumed that the userID has already been checked and does exist
 * @param userID
 * @param req
 * @param res
 * @param next
 */
function generateAccessTokenForUser(userID, req, res, next)
{
  // if it was a valid request but no user was found we return user not found
  if(userID == '')
  {
    error.send(res, error.userNotFound);
    return;
  }

  //by default tokens last 1 hour
  let expiry = GetUnixTime() + (60 * 60);

  let token = {
    token: auth.generateAccessToken(userID, expiry),
    expires: expiry
  };

  res.setHeader('Content-Type', 'application/json');
  res.cookie('tippe.ru.token', token.token, {expires: new Date(token.expires * 1000)});
	res.send(JSON.stringify(token));
}


/**
 * GetUnixTime
 * @return {number}
 */
function GetUnixTime() {
  return Math.round((new Date()).getTime() / 1000);
}

module.exports = router;
