'use strict';

let express = require('express');
let router = express.Router();

let auth = require('../helpers/auth.js');
let error = require('../helpers/error.js');
let user = require('../models/user.js');

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
router.post('/', function(req, res, next) {
  let req_body = req.body;

  // try and get a valid user from the request body
  if(typeof req_body.googleIdToken !== 'undefined')
  {
    auth.validateGoogleIDToken(req_body.googleIdToken).then(data => {
      const { payload } = data;
      let gId = payload.sub;

      user.getUserIDFromGoogleUserID(gId).then((userID) => {
        sendAccessTokenForUser(userID, req, res, next);
      }).catch(err => {

        // TODO: Prompt user for username

        // Add new user here
        user.addUser(payload.email, payload.name, null, gId).catch(err => {
					sendAccessTokenForUser(gId, req, res, next);
        });
      });
    }).catch((err) => {

      // TODO: Show error message

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
          // error.send(res, error.invalidCredentials);
          // return;
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
});


/**
 * Generates a valid access token for the passed usedID - it is assumed that the userID has already been checked and does exist
 * @param userID
 * @param req
 * @param res
 * @param next
 */
function sendAccessTokenForUser(userID, req, res, next)
{
  //by default tokens last 1 hour
  let expiry = Math.round((new Date()).getTime() / 1000) + (60 * 60);

  let token = {
    token: auth.generateAccessToken(userID, expiry),
    expires: expiry
  };

  req.session.loggedIn = 1;
  req.session.accessToken = token.token;

  res.setHeader('Content-Type', 'application/json');

	res.cookie('userId', userID, { expires: new Date(token.expires * 1000)});
  res.cookie('accessToken', token.token, { expires: new Date(token.expires * 1000)});

  res.send(token);
}
module.exports = router;
