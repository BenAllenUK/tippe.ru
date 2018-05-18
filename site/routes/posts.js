'use strict';

let express = require('express');
let router = express.Router();

let post = require('../models/post.js');
let region = require('../models/region.js');
let error = require('../helpers/error.js');

/**
 * Create a post
 * 	Endpoint: /api/posts/:id
 *
 *
 */
router.post('/create', function(req, res, next) {
	let userId = req.session.userId;

  let req_lat = req.query.lat;
  let req_long = req.query.long;

  if(req_lat == undefined || req_long == undefined)
  {
    error.send(res, error.invalidRequest);
    return;
  }

	res.setHeader('Content-Type', 'application/json');
	post.createPost(userId, req.body.title, req.body.content, req_long, req_lat, function() {
		res.send({ success: true });
	});
});

/**
 * Get a post
 * 	Endpoint: /api/posts/:id
 *
 *
 */
router.get('/:id', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	post.getPost(req.params.id, function (data) {
    if(data == undefined)
    {
      error.send(res, error.postNotFound);
    }
    else
    {
		    res.send(data);
    }
	});
});


/**
 * Get all posts
 * 	Endpoint: /api/posts
 */
router.get('/', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  let req_lat = req.query.lat;
  let req_long = req.query.long;

  if(req_lat == undefined || req_long == undefined)
  {
    error.send(res, error.invalidRequest);
    return;
  }

  region.getRegionID(req_long, req_lat, (regionId) => {
    console.log('Refresh from region ' + regionId);
    post.getPosts(regionId, function (data) {
      res.send(data);
    });
  });
});

/**
 */
router.post('/upvote', function(req, res, next) {
	let postId = req.body.postId;
	let userId = req.session.userId;
	let vote = req.body.vote;

	if(postId == undefined ||
		 userId == undefined ||
	 	 vote == undefined)
  {
    error.send(res, error.invalidRequest);
    return;
  }

	post.setUpvote(postId, userId, vote).then(() => {
		res.send({ success: true });
	}).catch((err) => {
		console.log(err);
		res.send({ success: false });
	});
});

module.exports = router;
