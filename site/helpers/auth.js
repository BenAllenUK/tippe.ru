'use strict';

let jwt = require('jsonwebtoken');
let { OAuth2Client } = require('google-auth-library');
let crypto = require('crypto');

let Auth = {
  // generates a token to send back to the user
	generateAccessToken: function (userID, expires) {
		let payload = {
			userID: userID,
			exp: expires
		};

		return jwt.sign(payload, process.env.JWT_SECRET);
	},

  //returns true if the passed JWT token is valid
  validateAccessToken: function (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (e) {
      return false;
    }

    return true;
  },

  // returns true if the passed JWT token is valid and is for the specified user
  validateAccessTokenForUser: function (token, userID) {
    try {
      let payload = jwt.verify(token, process.env.JWT_SECRET);
      return payload.userID == userID;
    }
    catch (e) {
      return false;
    }
  },

  //calls the passed callback with the google User ID and a boolean that is true if the token was valid
  validateGoogleIDToken: function (googleIdToken) {
    return new Promise(function (resolve, reject) {
      let client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, '', '');
      client.verifyIdToken({
        idToken: googleIdToken,
        audience: process.env.GOOGLE_CLIENT_ID
      }, function (e, info) {
        // callback when the verify function returns
        if (e == null) {
          resolve({ payload: info.payload });
        }
        else {
          reject();
        }
      });
    });
  },

  // returns true if the query password matches the one on file
  checkPassword: function (queryPassword, password, salt) {
    if (!Auth.validatePassword(queryPassword)) return false;
    return Auth.hashPassword(queryPassword, salt) == password;
  },

  // returns true if the input password follows the password rules set out
  validatePassword: function (password) {
    return password.length > 7;
  },

  // returns the hash for the input password
  hashPassword: function (password, salt) {
    if (salt === undefined || salt.length < 2)
      throw new Error('password salt was invalid or missing');

    return crypto.createHash('sha256').update(salt + password).digest('hex');
  },

  /**
   * Generates a valid access token for the passed usedID - it is assumed that the userID has already been checked and does exist
   * @param userID
   * @param req
   * @param res
   * @param next
   */
  sendAccessTokenForUser: function(userID, req, res, next)
  {
    //by default tokens last 1 hour
    let expiry = Math.round((new Date()).getTime() / 1000) + (60 * 60);

    let token = {
      token: this.generateAccessToken(userID, expiry),
      expires: expiry
    };

    req.session.loggedIn = 1;
    req.session.accessToken = token.token;

    res.setHeader('Content-Type', 'application/json');

  	res.cookie('userId', userID, { expires: new Date(token.expires * 1000)});
    res.cookie('accessToken', token.token, { expires: new Date(token.expires * 1000)});

    res.send(token);
  }
};

module.exports = Auth;
