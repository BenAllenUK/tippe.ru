'use strict';

let express = require('express');
let router = express.Router();

let post = require('../models/post.js');
let error = require('../helpers/error.js');

/**
 * Get a post
 * 	Endpoint: /api/posts/:id
 *
 *
 */
router.get('/:id', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	post.getPost(req.params.id, function (data) {
		res.send(data);
	});
});


/**
 * Get all posts
 * 	Endpoint: /api/posts
 */
router.get('/', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');

	post.getPosts(function (data) {
		res.send(data);
	});

});

module.exports = router;