// Functions included on every page

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