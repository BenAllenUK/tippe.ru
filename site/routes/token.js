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
    auth.validateGoogleIDToken(req_body.googleIdToken).then((valid, googleUserID) => {
        user.getUserIDFromGoogleUserID(googleUserID).then((userID) => {
          sendAccessTokenForUser(userID, req, res, next);
        });
      }).catch((err) => {
        error.send(res, error.invalidToken);
      });
  }
  else if(typeof req_body.usernameEmail !== 'undefined' && typeof req_body.password !== 'undefined')
  {
    let userID = -1;

    user.getUserIDFromUsernameEmail(req_body.usernameEmail).then((foundUserID) => {
      userID = foundUserID;
    }).then(() => {
      user.getStoredPassword(userID).then((password) => {
        if(password.val == '' || !auth.checkPassword(req_body.password, password.val, password.salt))
        {
          error.send(res, error.invalidCredentials);
          return;
        }

        sendAccessTokenForUser(userID, req, res, next);
      });
    });
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
function sendAccessTokenForUser(userID, req, res, next)
{
  // if it was a valid request but no user was found we return user not found
  if(userID == -1)
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
