// this function is called when the google script has finished loading in the background
function onGooglePlatformLoaded()
{
  if(typeof GOOGLE_CLIENT_ID === "undefined")
  {
    console.error("Unable to find google client ID, ensure the correct keys file has been included");
    return;
  }

  gapi.load('auth2', function() {
     gapi.auth2.init({
      client_id: GOOGLE_CLIENT_ID
    }).then(onGoogleFullyInitialised, function(error) {
      console.error("Failed to initialise google sign in");
    });
  });
}

function onGoogleFullyInitialised()
{
  //render the google sign in button on screen
  gapi.signin2.render('google-signin-button',
    {
      scope: 'email',
      width: 300,
      height: 75,
      longtitle: true,
      theme: 'light',
      onsuccess: onGoogleSignIn
    });
}

function onGoogleSignIn(googleUser)
{
  // TODO:
  // 1. parse out the user ID and details and send them to the server for an access token
  // 2a. if the server returns an error of user does not exist - take the user to setup a new account
  // 2b. if the token is valid redirect to the main app page
  // 3. once the user has completed the new user setup page

  var xhr = new XMLHttpRequest();
  xhr.open('POST', API_ROOT + "/token");
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    onAccessTokenReponse(xhr.responseText);
  };
  xhr.send(JSON.stringify({googleIdToken: googleUser.getAuthResponse().id_token}));
}

function onAccessTokenReponse(request)
{
  console.log(request.responseText);
}
