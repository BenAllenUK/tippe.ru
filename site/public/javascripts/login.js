function onFinialiseRegister()
{
  let payload = { username: document.getElementById("username").value }

  var auth2 = gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
    let profile = auth2.currentUser.get().getBasicProfile();
    payload.email = profile.getEmail();
    payload.googleUserID = profile.getId();
  } else {
    payload.email = document.getElementById("email").value;
    payload.password = document.getElementById("password-register").value;
  }

	ajaxRequest("PUT", "/api/users/create", payload, function(status, responseObj) {
		if (status == 200) {
		  window.location.href = "/";
    }
	});
}

function showRegisterPage()
{
	$(".loginPage").hide();
	$(".registerPage").show();
}

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
      onsuccess: function (s) {
				onGoogleSignIn(s);
			}
    });
}

function onGoogleSignIn(googleUser)
{
  // 1. parse out the user ID and details and send them to the server for an access token
  // 2a. if the server returns an error of user does not exist - take the user to setup a new account
  // 2b. if the token is valid redirect to the main app page
  // 3. once the user has completed the new user setup page

  ajaxRequest("POST", "/api/authenticate", { googleIdToken: googleUser.getAuthResponse().id_token }, function(status, responseObj) {
      if (status == 200) {
        window.location.href = "/";
      } else if (status == 404) {
        showRegisterPage();
			}
      else {
				onSignInError("Google error");
      }
  });
}

function onManualSignIn()
{
  // Create an AJAX request
  let payload = {
    usernameEmail: document.getElementById("usernameemail").value,
    password: document.getElementById("password-login").value
  };

  ajaxRequest("POST", "/api/authenticate", payload, function(status, responseObj) {
    if(status == 200) {
			window.location.href = "/";
    } else {
      onSignInError(responseObj.message);
    }

  });
}

function onSignInError(message) {
	// document.getElementById("login-submit").innerHTML = "Login";
	document.getElementById("login-error").innerHTML = "An error occurred when logging in : " + message;
}
