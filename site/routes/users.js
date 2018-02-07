"use strict";

let express = require('express');
let router = express.Router();

let user = require('../src/user.js');

/* Add a new user */
router.put('/', function(req, res, next) {
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

  user.addUser(email, username, password).then(userID => {
    res.send(JSON.stringify({userID: userID, username: username, email: email}));
  });
});

/* Get user details */
router.get('/:uid', function(req, res, next) {
  let userID = req.params.uid;
  error.send(res, error.invalidRequest);
});

/* Update user detials */
router.post('/:uid', function(req, res, next) {
  let userID = req.params.uid;
  error.send(res, error.invalidRequest);
});

module.exports = router;
