window.addEventListener('load', function() {
	setTimeout(onLoadIndex, 3000);
	$('.modal').modal();

	canvasElement = $('#canvas');
	canvasElement.mousedown(onMouseDown);
	canvasElement.mousemove(onMouseMove);
	canvasElement.mouseup(onMouseUp);
	canvasElement.mouseleave(onMouseLeave);

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
	postsMain.innerHTML = "";

  getGeoLocation(function(position)
  {
    if(position == undefined)
    {
      postsMain.innerHTML = "Unable to get location";
      return;
    }

    ajaxRequest('GET', '/api/posts?lat=' + position.coords.latitude + "&long=" + position.coords.longitude, {}, function(status, response) {
      postContainer.html("");
      stopAnimateRefreshIcon();
      response.forEach(function(item) {
        postContainer.append(markup(item))
      });
    });
  })
}

function onViewItem(itemId) {
	$("#itemView").css({"display": "block"}).animate({"opacity" : 1});
	$("#listView").animate({"opacity" : 0}).css({"display": "none"});
	$("#backButton").css({"display": "block"}).animate({"opacity" : 1});

	ajaxRequest('GET', '/api/posts/' + itemId, '', function(status, response) {
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

function onCreatePost() {
	let textContainer = $('#textarea1');
	let titleContainer = $('#input-title');

	let title = titleContainer.val();
	let content = textContainer.val();
	console.log('transmittedint');

  getGeoLocation(function(position)
  {
    if(position == undefined)
    {
      alert("Unable to get location");
      return;
    }

  	ajaxRequest('POST', '/api/posts/create?lat=' + position.coords.latitude + "&long=" + position.coords.longitude, { title: title, content: content }, function(status, response) {
  		textContainer.val("");
  		titleContainer.val("");
  		onRefresh();
  		console.log('refresh called')
  	});
  });
}

function postUpVote() {
	alert("Upvoted");
}

function postDownVote() {
	alert("Downvoted");
}

function createPost() {
	$('#createModal').modal('open');
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

/** Canvas stuff **/

let canvasDiv = document.getElementById('canvasDiv');
let stickerDiv = document.getElementById('stickerDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', "730");
canvas.setAttribute('height', "300");
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);
context = canvas.getContext("2d");
var stickerData = [];


let clickX = [];
let clickY = [];
let colourHistory = [];
let clickDrag = [];
let paint;

canvasElement = null;
let color = "red";
let stickerCount = 0;


function redraw(){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

	context.strokeStyle = color;

	context.lineJoin = "round";
	context.lineWidth = 5;

	for(let i=0; i < clickX.length; i++) {
		context.strokeStyle = colourHistory[i];
		context.beginPath();

		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.stroke();
	}

	for (let i =0; i < stickerData.length; i ++) {
		context.font = stickerData[i].fontSize + "px Arial";
		context.fillText(stickerData[i].text, stickerData[i].position[0], stickerData[i].position[1]);
	}
}

var movingEmoji = false;
var movingId = -1;

function onMouseDown(e) {
	let x = e.pageX - canvasElement.offset().left;
	let y = e.pageY - canvasElement.offset().top;

	for (let i = 0; i < stickerData.length; i++) {
		if (stickerData[i].position[0] - 30 < x && x < stickerData[i].position[0] + 30
			&& stickerData[i].position[1] - 30 < y && y < stickerData[i].position[1] + 30
		) {
			movingEmoji = true;
			movingId = i;
			break;
		}
	}

	if (movingEmoji) {
		return;
	}


	paint = true;
	addClick(e.pageX - canvasElement.offset().left, e.pageY - canvasElement.offset().top);
	redraw();
}

function onMouseUp(e) {
	paint = false;
	movingEmoji = false;
}

function onMouseMove(e) {
	if (movingEmoji) {
		stickerData[movingId].position = [e.pageX - canvasElement.offset().left, e.pageY - canvasElement.offset().top];
		redraw();
		return;
	}

	if(paint){
		addClick(e.pageX - canvasElement.offset().left, e.pageY - canvasElement.offset().top, true);
		redraw();
		return;
	}


}

function onMouseLeave(e) {
	paint = false;
	movingEmoji = false;
}

function onColourClick(local_color) {
	color = local_color;
}


function addClick(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	colourHistory.push(color)
}

function onToggleStickers() {
	let stickerContainer = $('#stickerContainer');
	let stickerSizer = $('#stickerSizer');
	if (stickerContainer.is(':visible')) {
		stickerContainer.hide();
		stickerSizer.hide();
	} else {
		stickerContainer.show();
		stickerSizer.show();
	}

}

function onClickEmoji(emoji) {
	if (emoji == "laugh") {
		let text = "😂";
		let position = [30, 30];
		let fontSize = 30;

		canvas.font = fontSize + "px Arial";
		context.fillText(text, position[0], position[1]);

		stickerData.push({
			stickerId: stickerCount + 1,
			text: text,
			position: position,
			fontSize: fontSize
		});

		stickerCount++;
	}
}

function onStickerSizeChange(size) {
	console.log("size change");

	let selectedEmojiId = movingId == -1 ? stickerCount - 1 : movingId;

	if (size == 1) {
		stickerData[selectedEmojiId].fontSize += 5;
		redraw();
	} else if (size == -1) {
		stickerData[selectedEmojiId].fontSize -= 5;
		redraw();
	}

}
