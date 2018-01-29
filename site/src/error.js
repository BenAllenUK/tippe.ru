"use strict";
// Errors to send when the API is misused - these are not server errors

var Error = function() {}

// function to send one of the error prototypes
Error.send = function(res, error)
  {
    res.setHeader('Content-Type', 'application/json');
    res.status(error.status);

    var error_obj = { title: error.title, message: error.msg };
    res.send(JSON.stringify(error_obj));
  };

// Error prototypes
Error.invalidRequest = { status: 400, title: "InvalidRequest", msg: "Request was invalid"};
Error.userNotFound = { status: 404, title: "UserNotFound", msg: "The specified user does not exist"};
Error.invalidToken = { status: 401, title: "InvalidToken", msg: "The required token was invalid for this request"};
Error.invalidCredentials = { status: 401, title: "invalidCredentials", msg: "Credientials passed were invalid"};

module.exports = Error;
