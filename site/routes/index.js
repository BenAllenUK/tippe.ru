var express = require('express');
var router = express.Router();

var posts = [
  {
    id: 123123,
    userId: 123123123,
    userImage: "foo.jpg",
    userName: "Benny",
    message: "hello world",
    upVotes: 12,
    downVotes: 9
  },
	{
		id: 123124,
		userId: 123123123,
		userImage: "foo.jpg",
		userName: "Benny1",
		message: "hello world1",
		upVotes: 12,
		downVotes: 9
	},
	{
		id: 123125,
		userId: 123123123,
		userImage: "foo.jpg",
		userName: "Benny2",
		message: "hello worl2d",
		upVotes: 12,
		downVotes: 9
	}
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express2', items: posts });
});

router.get('/api/posts', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(posts));
});

module.exports = router;
