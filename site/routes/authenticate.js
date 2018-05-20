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
        console.log(gId + '=>' + userID);
        auth.sendAccessTokenForUser(userID, req, res);
      }).catch(err => {
        error.send(res, error.userNotFound);
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

        auth.sendAccessTokenForUser(userID, req, res);
      });
    });
  }
  else
  {
    // neither of the required parameter sets were passed so we return invalid request
    error.send(res, error.invalidRequest);
  }
});

module.exports = router;
