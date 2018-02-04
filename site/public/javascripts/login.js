Initialise();

function Initialise()
{
  let loginButton = document.getElementById("login-submit");
  let registerButton = document.getElementById("register-submit");
  let register2Button = document.getElementById("register2-submit");

  loginButton.addEventListener("click", onManualSignIn);
  registerButton.addEventListener("click", onManualRegister);
  register2Button.addEventListener("click", onFinialiseRegister);
}


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
  // 1. parse out the user ID and details and send them to the server for an access token
  // 2a. if the server returns an error of user does not exist - take the user to setup a new account
  // 2b. if the token is valid redirect to the main app page
  // 3. once the user has completed the new user setup page

  APIRequest("POST", "/api/token", JSON.stringify({googleIdToken: googleUser.getAuthResponse().id_token}), function(status, responseObj) {
      onGoogleAccessTokenReponse(status, responseObj);
  });
}

function onGoogleAccessTokenReponse(status, responseObj)
{
  if(status == 200)
  {
    redirectToApp();
    return;
  }

  if(responseObj.title == "UserNotFound")
  {
    // TODO: Re-enable this when the register page is working properly
    //showRegisterPage();
  }
}

function onManualSignIn()
{
  document.getElementById("login-submit").innerHTML = "Logging in...";


  // create an AJAX request
  APIRequest("POST", "/api/token", JSON.stringify({usernameEmail: document.getElementById("usernameemail").value, password: document.getElementById("password-login").value}), function(status, responseObj) {
      onManualAccessTokenResponse(status, responseObj);
  });
}

function onManualAccessTokenResponse(status, responseObj)
{
  if(status == 200)
  {
    redirectToApp();
    return;
  }

  document.getElementById("login-submit").innerHTML = "Login";
  document.getElementById("login-error").innerHTML = "An error occurred when logging in : " + responseObj.message;
}

function onManualRegister()
{
  document.getElementById("register-submit").innerHTML = "Creating account...";
}

function onFinialiseRegister()
{
  APIRequest("PUT", "/api/user", JSON.stringify({email: "", username: "", password: ""}), function(status, responseObj) {
      onFinialiseRegisterResponse(status, responseObj);
  });
}

function onFinialiseRegisterResponse(status, responseObj)
{
  if(status == 200)
  {
    redirectToApp();
    return;
  }
}

function showRegisterPage()
{
  $(".loginPage").hide();
  $(".registerPage").show();
}
