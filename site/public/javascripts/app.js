// Functions included on every page
window.addEventListener('load', function() {
	animateLoadingText(0);
});

// API
function ajaxRequest(method, endpoint, content, callback)
{
  let xhr = new XMLHttpRequest();
  xhr.open(method, endpoint);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    let responseAsJSON = null;

    try
    {
      responseAsJSON = JSON.parse(xhr.responseText);

      // if the request was unauthorised (e.g. expired token) log out the user
      if(responseAsJSON.status != 200 && responseAsJSON.title == "InvalidToken")
      {
        console.log("Failed to access protected resource");
      }
      else
      {
        callback(xhr.status, responseAsJSON);
      }
    }
    catch(err)
    {
      console.warn(err);
      callback(xhr.status, xhr.responseText);
    }
  };

  xhr.send(JSON.stringify(content));
}

// wrapper for geolocation, callback is garanteed to return
function getGeoLocation(callback)
{

  if (navigator.geolocation)
  {
      navigator.geolocation.getCurrentPosition(function(position) {
        callback(position);
    	}, function(error) {
        callback(undefined);
      },
      { timeout: 60000 });
  }
  else
  {
    callback(undefined);
  }
}

// returns the value of a parameter or the default value if it was not specified
function getHTMLParam(paramkey, defaultval = false)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i=0;i<vars.length;i++)
  {
    var pair = vars[i].split("=");
    if(pair[0] == paramkey)
      return pair[1];
  }

  return defaultval;
}

function setHTMLParam(paramkey, paramval)
{
  var query = window.location.href.split("?");
  var vars = (query.length > 1) ? query[1].split("&") : [];

  var done = false;
  var newSearch = "";

  // if the param already exists then replace the value
  for (var i=0;i<vars.length;i++)
  {
    var pair = vars[i].split("=");
    if(pair[0] == paramkey)
    {
      pair[1] = String(paramval);
      done = true;
    }

    if(newSearch == "")
      newSearch = "?"
    else
      newSearch = newSearch + "&"

    newSearch = newSearch + pair[0] + "=" + pair[1];
  }

  if(done == false)
  {
    if(newSearch == "")
      newSearch = "?"
    else
      newSearch = newSearch + "&"

    newSearch = newSearch + paramkey + "=" + String(paramval);
  }

  var newUrl = query[0] + newSearch;

  if (history.pushState) {
    window.history.pushState("change view", "Title", newUrl);
  } else {
    document.location.href = newUrl;
  }
}

function removeHTMLParam(paramkey)
{
  var query = window.location.href.split("?");
  var vars = (query.length > 1) ? query[1].split("&") : [];
  var newSearch = "";

  for (var i=0;i<vars.length;i++)
  {
    var pair = vars[i].split("=");
    if(pair[0] == paramkey) continue;

    if(newSearch == "")
      newSearch = "?"
    else
      newSearch = newSearch + "&"

    newSearch = newSearch + pair[0] + "=" + pair[1];
  }

  var newUrl = query[0] + newSearch;

  if (history.pushState) {
    window.history.pushState("change view", "Title", newUrl);
  } else {
    document.location.href = newUrl;
  }
}

/** ANIMATION **/

function animateLoadingText(num) {
	let items = ["gossip", "secrets", "rumours", "stories"];
	let centerPageSlogan = $('.introPageCenterSlogan');
	centerPageSlogan.fadeOut(300, () => {
		centerPageSlogan.text("loading " + items[num] + "...");
		centerPageSlogan.fadeIn(300);
	});

	if (num < 4 ) {
		setTimeout(() => {animateLoadingText(num + 1)}, 1000)
	} else {
  	$("#mainPage").css({"display": "block"}).animate({"opacity" : 1});
  	$("#introPage").animate({"opacity" : 0}).css({"display": "none"});
  }
}
