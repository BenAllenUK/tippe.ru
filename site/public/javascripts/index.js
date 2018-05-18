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
 	<div class="col s7">
    <span class="card-title">${message.title}</span>
    <p class="card-content">${message.content}</p>
	</div>
	<div class="col s1">
		${message.image != "" ?  showAttachmentSVG() : ''}
	</div>
	<div class="col s2">
		<div class="card-votes">
			<div class="card-votes-overlay" onclick="(e) => e.stopPropagation()" style="display: ${message.posvotes == 0 && message.negvotes == 0 ? "block": "none"}"></div>
			<div class="card-upvotes"><a onclick="postUpVote(event, ${message.id}, ${message.posvotes})" href="#"> 👍<br/><span id="vote-count">${message.posvotes}</span></a></div>
			<div class="card-downvotes"><a onclick="postDownVote(event, ${message.id}, ${message.negvotes})" href="#">👎<br/><span id="vote-count">${message.negvotes}</span></a></div>
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
			<div class="card-votes-overlay" onclick="(e) => e.stopPropagation()" style="display: ${message.posvotes == 0 && message.negvotes ? "block": "none"}"></div>
			<div class="card-upvotes"><a id="card-upvotes-link" onclick="postUpVote(event, ${message.id}, ${message.posvotes})" href="#"> 👍<br/><span id="vote-count">${message.posvotes}</span></a></div>
			<div class="card-downvotes"><a id="card-downvotes-link" onclick="postDownVote(event, ${message.id}, ${message.negvotes})" href="#">👎<br/><span id="vote-count">${message.negvotes}</span></a></div>
		</div>
	</div>
 </div>
 <div class="card row">
 <img src="${message.image}" alt="" width="730" height="300">
 </div>
`;

const postNotFoundMarkup = () => `
 <div class="card row">
 	<div class="col s8 offset-s2">
    <span class="card-title">We're having trouble loading this post</span>
    <p class="card-content">Sorry about that</p>
	</div>
 </div>
`;

/** Callbacks **/

function onLoadIndex() {
	$("#menuButton").animate({"opacity" : 1}).css({"display": "block"});
	onRefresh();

  var requestedPost =  getHTMLParam("p");

  if(requestedPost != false)
  {
    onViewItem(requestedPost);
  }
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

  setHTMLParam("p", itemId + "");

	ajaxRequest('GET', '/api/posts/' + itemId, '', function(status, response) {
    let postContainer = $('#post');
    postContainer.html("");
    if(status == 200)
    {
      postContainer.append(postMarkup(response));
    }
    else
    {
      postContainer.append(postNotFoundMarkup());
    }
	});

}

function onBackButton() {
	$("#backButton").animate({"opacity" : 0}).css({"display": "none"});
	$("#listView").css({"display": "block"}).animate({"opacity" : 1});
	$("#itemView").animate({"opacity" : 0}).css({"display": "none"});

  removeHTMLParam("p");
}

function onCreatePost() {
	let textContainer = $('#textarea1');
	let titleContainer = $('#input-title');

	let dataurl = document.getElementsByTagName("canvas")[0].toDataURL();

	console.log(dataurl);
	let title = titleContainer.val();
	let content = textContainer.val();
	console.log('transmittedint');

	ajaxRequest('POST', '/api/posts/create?lat=51.456&long=-2.5983', { title: title, content: content, dataUrl: dataurl }, function(status, response) {
		textContainer.val("");
		titleContainer.val("");
		onRefresh();
		console.log('refresh called')
	});

  // getGeoLocation(function(position)
  // {
  //   if(position == undefined)
  //   {
  //     alert("Unable to get location");
  //     return;
  //   }
	//
  // 	ajaxRequest('POST', '/api/posts/create?lat=' + position.coords.latitude + "&long=" + position.coords.longitude, { title: title, content: content }, function(status, response) {
  // 		textContainer.val("");
  // 		titleContainer.val("");
  // 		onRefresh();
  // 		console.log('refresh called')
  // 	});
  // });
}

function postUpVote(e, itemId, votes) {
	// if (votes == 0) {
		let current = parseInt(e.path[0].children[1].innerHTML);
		e.path[0].children[1].innerHTML = current + 1;
	// }
	e.path[2].children[0].style.display = "block";
	console.log();
	//card-votes-overlay
	sendVote(itemId, 1);
	e.stopPropagation();
}

function postDownVote(e, itemId, votes) {
	// if (votes == 0) {
		let current = parseInt(e.path[0].children[1].innerHTML);
		e.path[0].children[1].innerHTML = current + 1;
	// }
	e.path[2].children[0].style.display = "block";
	sendVote(itemId, 2);
	e.stopPropagation();
}

function sendVote(itemId, vote)
{
	ajaxRequest('POST', '/api/posts/upvote', { postId: itemId, vote: vote }, function(status, response) {

	});
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

function showAttachmentSVG() {
	return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px"
	 height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
<g id="Bounding_Boxes">
	<g id="ui_x5F_spec_x5F_header_copy_3">
	</g>
	<path fill="none" d="M0,0h24v24H0V0z"/>
</g>
<g id="Outline">
	<g id="ui_x5F_spec_x5F_header">
	</g>
	<path d="M16.5,6v11.5c0,2.21-1.79,4-4,4s-4-1.79-4-4V5c0-1.38,1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5v10.5c0,0.55-0.45,1-1,1
		s-1-0.45-1-1V6H10v9.5c0,1.38,1.12,2.5,2.5,2.5s2.5-1.12,2.5-2.5V5c0-2.21-1.79-4-4-4S7,2.79,7,5v12.5c0,3.04,2.46,5.5,5.5,5.5
		s5.5-2.46,5.5-5.5V6H16.5z"/>
</g>
</svg>`

}
