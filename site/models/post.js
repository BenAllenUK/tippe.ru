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
	},

	//sets whether a user has upvoted a post or not, 0 indicates no vote, 1 indicates upvote, 2 indicates downvotes
	setUpvote(postId, userId, newVote) {
		let upVoteChange = 0;
		let downVoteChange = 0;

		if(newVote > 0)
		{
			newVote = 1;
			upVoteChange = 1;
		}
		else if (newVote < 0)
		{
			newVote = -1;
			downVoteChange = 1;
		}


		return new Promise(function(resolve, reject) {
			dbPromise.then((db) => {
				db.get(`SELECT * FROM Upvote WHERE Upvote.userId='${userId}' AND Upvote.postId='${postId}'`).then((row) => {
					let previousVote = 0;

					if(row != undefined)
					{
						previousVote = row.vote;
					}

					if(previousVote == newVote)
					{
						resolve();
						return;
					}

					// if we had previously voted ensure we subtract that vote from the totals
					if(previousVote != 0 && upVoteChange > 0)
						downVoteChange = -1;
					else if(previousVote != 0 && downVoteChange > 0)
						upVoteChange = -1;

					dbPromise.then(db => {
						db.run(`BEGIN;`);
						db.run(`INSERT OR REPLACE INTO Upvote (userId, postId, vote) VALUES(${userId}, ${postId}, ${newVote});`);
						db.run(`UPDATE OR ROLLBACK Post SET upVotes = upVotes + ${upVoteChange}, downVotes = downVotes + ${downVoteChange} WHERE Post.id=${postId};`);
						db.run(`COMMIT;`);
					}).then(() => {
						resolve();
					}).catch((err) => {
						reject(err);
					});
				});
			});
		});
	}

	// TODO: Add Post

	// TODO: Update post

	// TODO: Delete Post

};

module.exports = post;
