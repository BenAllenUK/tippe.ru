// Functions included on every page

// API
function APIRequest(method, endpoint, content, callback)
{
  var xhr = new XMLHttpRequest();
  xhr.open(method, endpoint);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    let responseAsJSON = null;

    try
    {
      responseAsJSON = JSON.parse(xhr.responseText);

      // if the request was unauthorised (e.g. expired token) log out the user
      if(IsLoggedIn() && responseAsJSON.status != 200 && responseAsJSON.title == "InvalidToken")
      {
        console.log("Failed to access protected resource");
        LogOut();
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

  xhr.send(content);
}

// Navigation

function redirectToApp()
{
  window.location.replace("/");
}

function redirectToLogin()
{
  window.location.replace("/login");
}


// Auth

function IsLoggedIn()
{
  return GetAccessToken() != '';
}

function GetLoggedInUserID()
{
  let obj = JSON.parse(atob(GetAccessToken().split(".")[1]));
  return obj.userID;
}

function GetAccessToken()
{
  return getCookie("tippe.ru.token");
}

// taken from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function LogOut()
{
  // clear cookie
  redirectToLogin();
}
