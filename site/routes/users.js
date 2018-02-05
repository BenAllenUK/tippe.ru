"use strict";

let express = require('express');
let router = express.Router();

/* Add a new user */
router.put('/', function(req, res, next) {
  res.status(404);
  res.send("");
});

module.exports = router;
