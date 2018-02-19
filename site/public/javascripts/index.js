window.addEventListener('load', function() {
	setTimeout(onLoadIndex, 3000);
});

/** ELEMENTS **/

const markup = message => `
 <div class="card row" onclick="onViewItem(${message.id})">
	<div class="col s2">
		<div class="posts-profile">
			<img src="images/users/${message.userImage}" onerror="this.src='images/users/default.png'" alt="" width="50" height="50" class="circle posts-profile-icon">
		</div>
	</div>
 	<div class="col s8">
    <span class="card-title">${message.title}</span>
    <p class="card-content">${message.content}</p>


	</div>
	<div class="col s2">
		<div class="card-votes">
			<div class="card-upvotes"><a onclick="postUpVote()" href="#"> 👍<br/>${message.upVotes}</a></div>
			<div class="card-downvotes"><a onclick="postDownVote()" href="#">👎<br/>${message.downVotes}</a></div>
		</div>
	</div>
 </div>
`;

const postMarkup = message => `
 <div class="card row" onclick="onViewItem(${message.id})">
	<div class="col s2">
		<div class="posts-profile">
			<img src="images/users/${message.userImage}" onerror="this.src='images/users/default.png'" alt="" width="50" height="50" class="circle posts-profile-icon">
		</div>
	</div>
 	<div class="col s8">
    <span class="card-title">${message.title}</span>
    <p class="card-content">${message.content}</p>


	</div>
	<div class="col s2">
		<div class="card-votes">
			<div class="card-upvotes"><a onclick="postUpVote()" href="#"> 👍<br/>${message.upVotes}</a></div>
			<div class="card-downvotes"><a onclick="postDownVote()" href="#">👎<br/>${message.downVotes}</a></div>
		</div>
	</div>
 </div>
`;

/** Callbacks **/

function onLoadIndex() {
	$("#mainPage").css({"display": "block"}).animate({"opacity" : 1});
	$("#introPage").animate({"opacity" : 0}).css({"display": "none"});
	onRefresh();
}

function onRefresh() {
	startAnimateRefreshIcon();
	let postContainer = $('#postsMain');
	postsMain.innerHTML = "hi";

	$.ajax({ url:'/api/posts', type:'GET' }).done(function(response) {
		postContainer.html("");
		stopAnimateRefreshIcon();
		response.forEach(function(item) {
			postContainer.append(markup(item))
		});
	});
}

function onViewItem(itemId) {
	$("#itemView").css({"display": "block"}).animate({"opacity" : 1});
	$("#listView").animate({"opacity" : 0}).css({"display": "none"});
	$("#backButton").css({"display": "block"}).animate({"opacity" : 1});

	$.ajax({ url: '/api/posts/' + itemId, type:'GET' }).done(function(response) {
		let postContainer = $('#post');
		postContainer.html("");
		postContainer.append(postMarkup(response));

	});

}

function onBackButton() {
	$("#backButton").animate({"opacity" : 0}).css({"display": "none"});
	$("#listView").css({"display": "block"}).animate({"opacity" : 1});
	$("#itemView").animate({"opacity" : 0}).css({"display": "none"});
}

function postUpVote() {
	alert("Upvoted");
}

function postDownVote() {
	alert("Downvoted");
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
