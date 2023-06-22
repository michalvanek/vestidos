const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader) {
    res.status(401).send("Authorization header missing");
    return;
  }

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // Access token verification failed, try refreshing using the refresh token
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
          if (err) {
            res.status(401).send("User is not authorized");
          } else {
            req.user = decoded.user;
            next();
          }
        });
      } else {
        // Access token is valid, set the user object in the request and proceed
        req.user = decoded.user;
        next();
      }
    });
  } else {
    res.status(401).send("User is not authorized or token is missing");
  }
});

module.exports = validateToken;
