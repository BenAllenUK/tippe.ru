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
      { timeout: 4000 });
  }
  else
  {
    callback(undefined);
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
	}
}
