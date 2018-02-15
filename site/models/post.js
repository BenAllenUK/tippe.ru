'use strict';

let db = require('sqlite');

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

	getPosts(callback) {
		dbPromise.then((db) => {
			db.all('SELECT * FROM Post INNER JOIN User ON Post.userId=User.id LIMIT 10').then(posts => {
				callback(posts);
			});
		});
	}

	// TODO: Add Post

	// TODO: Update post

	// TODO: Delete Post

};

module.exports = post;
