/** Private functions **/

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
      SignOutComplete();
    });
  });
}

function onGoogleFullyInitialised()
{
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('Google signed out');
    SignOutComplete();
  });
}

function SignOutComplete()
{
  $("#loggedOut").css({"display": "block"}).animate({"opacity" : 1});
  $("#loggingOut").animate({"opacity" : 0}).css({"display": "none"});
}
