

window.onload = function() {
	setTimeout(onRefresh, 1000);
};

/** ELEMENTS **/

const markup = message => `
 <div class="card row" onclick="onViewItem(${message.id})">
	<div class="col s2">
		<div class="posts-profile">
			<img src="images/users/${message.userImage}" onerror="this.src='images/users/default.png'" alt="" width="50" height="50" class="circle posts-profile-icon">
		</div>
	</div>
 	<div class="col s8">
    <span class="card-title">${message.userName}</span>
    <p class="card-content">${message.message}</p>
    
    
	</div>
	<div class="col s2">
		<div class="card-votes">
			<div class="card-upvotes">${message.upVotes}</div>
			<div class="card-downvotes">${message.downVotes}</div>
		</div>
	</div>
 </div>
`;

/** Callbacks **/

function onRefresh() {
	startAnimateRefreshIcon();

	$.ajax({ url:'/api/posts', type:'GET' }).done(function(response) {
		let postContainer = $('#posts');
		postContainer.html("");
		stopAnimateRefreshIcon();
		response.forEach(function(item) {
			postContainer.append(markup(item))
		});

	});
}

function onViewItem(itemId) {
	startAnimatingPageMove();

	$.ajax({ url:'/api/posts/' + itemId, type:'GET' }).done(function(response) {
		// let postContainer = $('#posts');
		// postContainer.html("");
		//
		// response.forEach(function(item) {
		// 	postContainer.append(markup(item))
		// });
	});

}

/** Animation **/

function startAnimateRefreshIcon() {
	let refreshIcon = $('.posts-refresh');
	refreshIcon.addClass('posts-refresh-animate');

}

function stopAnimateRefreshIcon() {
	let refreshIcon = $('.posts-refresh');

	setTimeout(function () {
		refreshIcon.removeClass('posts-refresh-animate');
	}, 500);
}

function startAnimatingPageMove() {
	let postsPage = $('.mainPage');
	postsPage.addClass('page-animate-left');

	setTimeout(function () {
		postsPage.removeClass('page-animate-left');
	}, 1000)
}



function startAnimatingPageReturn() {
	let postsPage = $('.post');
	postsPage.addClass('page-animate-right');

	setTimeout(function () {
		postsPage.removeClass('page-animate-right');
	}, 1000)
}
