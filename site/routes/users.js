'use strict';

let express = require('express');
let router = express.Router();

let user = require('../models/user.js');
let error = require('../helpers/error.js');

/**
 * Add a new user
 *  Endpoint: /api/user/create
 *
 *
 */
router.put('/create', function(req, res, next) {
  //we must have been passed the minimum number of params to process the request
  let req_body = req.body;

  if(typeof req_body.username === 'undefined' ||
      typeof req_body.email === 'undefined' ||
    (typeof req_body.password === 'undefined' && typeof req_body.googleUserID === 'undefined'))
  {
    error.send(res, error.invalidRequest);
    return;
  }

  let password = (typeof req_body.password === 'undefined') ? '' : req_body.password;
  let googleUserID = (typeof req_body.googleUserID === 'undefined') ? '' : req_body.googleUserID;

  user.addUser(req_body.email, req_body.username, password, googleUserID).then(userID => {
    res.send({userID: userID, username: req_body.username, email: req_body.email});
  });
});

/**
 * Get a users details
 *  Endpoint: /api/user/:uid
 *
 */
router.get('/:uid', function(req, res, next) {
  let userID = req.params.uid;
  error.send(res, error.invalidRequest);
});

/**
 * Update a users details
 *  Endpoint: /api/user/:uid
 *
 */
router.post('/:uid', function(req, res, next) {
  let userID = req.params.uid;
  error.send(res, error.invalidRequest);
});

module.exports = router;
