window.addEventListener('load', function() {
	setTimeout(onLoadIndex, 3000);
	$('.modal').modal();

	canvasElement = $('#canvas');
	canvasElement.mousedown(onMouseDown);
	canvasElement.mousemove(onMouseMove);
	canvasElement.mouseup(onMouseUp);
	canvasElement.mouseleave(onMouseLeave);

  window.onpopstate = onHistoryPopState;
});


// 0 - feed
// 1 - item view
let curPage = 0;

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
			<div class="card-upvotes ${message.userVote == 1 ? "active" : ""}"><a onclick="postUpVote(event, ${message.id}, this)" href="javascript:void(0);"> 👍<br/><span id="vote-count">${message.posvotes}</span></a></div>
			<div class="card-downvotes ${message.userVote == -1 ? "active" : ""}"><a onclick="postDownVote(event, ${message.id}, this)" href="javascript:void(0);">👎<br/><span id="vote-count">${message.negvotes}</span></a></div>
		</div>
	</div>
 </div>
`;

const postMarkup = message => `
 <div class="card row">
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
			<div class="card-upvotes ${message.userVote == 1 ? "active" : ""}"><a id="card-upvotes-link" onclick="postUpVote(event, ${message.id}, this)" href="javascript:void(0);"> 👍<br/><span id="vote-count">${message.posvotes}</span></a></div>
			<div class="card-downvotes ${message.userVote == -1 ? "active" : ""}"><a id="card-downvotes-link" onclick="postDownVote(event, ${message.id}, this)" href="javascript:void(0);">👎<br/><span id="vote-count">${message.negvotes}</span></a></div>
		</div>
	</div>

	<div class="col s2 offset-s8">
    <a class="waves-effect waves-light btn socialButton sb-fb"
    href="https://www.facebook.com/sharer/sharer.php?s=100&p[url]=${encodeURI(window.location.href)}"
    target="_blank">
      <img src='/images/icons/flogo.svg'/><span>Share</span>
    </a>
  </div>
  <div class="col s2">
    <a class="waves-effect waves-light btn socialButton sb-twitter"
    href="https://twitter.com/intent/tweet?text=Check%20out%20this%20secret%20on%20tippe.ru&url=${encodeURI(window.location.href)}"
    target="_blank">
    <img src='/images/icons/tlogo.svg'/>Tweet</a>
  </div>
 </div>
 ${message.image != "" ?  showDrawingDiv(message) : ''}
`;

function showDrawingDiv(message)
{
  return `<div class="card row">
    <img src="${message.image}" alt="" width="730" height="300">
    </div>`;
}

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
  setPage(1);

  setHTMLParam("p", itemId + "");

  loadViewItem(itemId);
}

function loadViewItem(itemId)
{
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

function onHistoryPopState()
{
  var pTag = getHTMLParam("p");
  if(pTag != false)
  {
    // if the new state contains the p tag, view that post
    setPage(1);
    loadViewItem(pTag);
  }
  else
  {
    // otherwise refresh the main page
    setPage(0);
  }
}

function setPage(newPage)
{
  if(newPage == curPage) return;

  if(newPage == 0)
  {
  	$("#backButton").animate({"opacity" : 0}).css({"display": "none"});
  	$("#listView").css({"display": "block"}).animate({"opacity" : 1});
  	$("#itemView").animate({"opacity" : 0}).css({"display": "none"});
    onRefresh();
  }
  else if(newPage == 1)
  {
  	$("#itemView").css({"display": "block"}).animate({"opacity" : 1});
  	$("#listView").animate({"opacity" : 0}).css({"display": "none"});
  	$("#backButton").css({"display": "block"}).animate({"opacity" : 1});
  }

  curPage = newPage;
}

function onBackButton() {
  setPage(0);
  removeHTMLParam("p");
}

function onCreatePost() {
	let textContainer = $('#textarea1');
	let titleContainer = $('#input-title');

	let dataurl = document.getElementsByTagName("canvas")[0].toDataURL();

  // override as empty string if there is no drawing
  if(isEmptyDrawing())
  {
    dataurl = "";
  }

	console.log(dataurl);
	let title = titleContainer.val();
	let content = textContainer.val();
	console.log('transmittedint');

  getGeoLocation(function(position)
  {
    if(position == undefined)
    {
      alert("Unable to determine location");
      return;
    }

  	ajaxRequest('POST', '/api/posts/create?lat=' + position.coords.latitude + '&long=' + position.coords.longitude, { title: title, content: content, dataUrl: dataurl }, function(status, response) {
  		textContainer.val("");
  		titleContainer.val("");
  		onRefresh();
  		console.log('refresh called')
  	});
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

function postUpVote(e, itemId, element) {
	e.stopPropagation();

	let div = element.parentElement;
	if(div.classList.contains('active')) return;

	let current = parseInt(div.children[0].children[1].innerHTML);
	div.children[0].children[1].innerHTML = current + 1;

	div.classList.add('active');

	let dvLabel = div.parentElement.children[1];

	if(dvLabel.classList.contains('active'))
	{
		dvLabel.classList.remove('active');

		let dvCount = dvLabel.children[0].children[1];
		let current = parseInt(dvCount.innerHTML);
		dvCount.innerHTML = current - 1;
	}

	sendVote(itemId, 1);
}

function postDownVote(e, itemId, element) {
	e.stopPropagation();

	let div = element.parentElement;
	if(div.classList.contains('active')) return;

	let current = parseInt(div.children[0].children[1].innerHTML);
	div.children[0].children[1].innerHTML = current + 1;

	div.classList.add('active');

	let dvLabel = div.parentElement.children[0];
	if(dvLabel.classList.contains('active'))
	{
		dvLabel.classList.remove('active');

		let dvCount = dvLabel.children[0].children[1];
		let current = parseInt(dvCount.innerHTML);
		dvCount.innerHTML = current - 1;
	}

	sendVote(itemId, -1);
}

function sendVote(itemId, vote)
{
	ajaxRequest('POST', '/api/posts/upvote', { postId: itemId, vote: vote }, function(status, response) {

	});
}

function createPost() {
  // clear any previous data
  clearCanvas();
	$('#textarea1').val("");
	$('#input-title').val("");

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

function isEmptyDrawing()
{
  return clickX.length == 0 && stickerData == 0;
}

function clearCanvas()
{
  clickX = [];
  clickY = [];
  clickDrag = [];
  stickerData = [];
  colourHistory = [];
  redraw();
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
