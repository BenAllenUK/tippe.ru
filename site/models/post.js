'use strict';

let db = require('sqlite');

let region = require('../models/region.js');

const dbPromise = Promise.resolve()
	.then(() => db.open('./database.db', { Promise }));

let post = {
	getPost(itemId, callback) {
		dbPromise.then((db) => {
			db.get(`SELECT * FROM Post JOIN User ON Post.userId=User.id WHERE Post.id='${itemId}' LIMIT 1`).then(post => {
				callback(post);
			});
		});
	},

	createPost(userId, title, content, longitude, latitude, callback) {
		console.log(userId);
    region.getRegionID(longitude, latitude, (regionId) => {
      console.log('Create post in region ' + regionId);
  		dbPromise.then((db) => {
  			db.run('INSERT INTO Post (id, userId, longitude, latitude, regionId, title, content, upVotes, downVotes) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, longitude, latitude, regionId, title, content, 0, 0 ]).then(post => {
  				callback();
  			});
  		});
    });
	},

	getPosts(regionId, callback) {
		dbPromise.then((db) => {
			db.all(`SELECT * FROM Post INNER JOIN User ON Post.userId=User.id WHERE Post.regionId='${regionId}' ORDER BY Post.timeCreated DESC`).then(posts => {
				callback(posts);
			});
		});
	}

	// TODO: Add Post

	// TODO: Update post

	// TODO: Delete Post

};

module.exports = post;
