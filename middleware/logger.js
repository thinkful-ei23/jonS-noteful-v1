'use strict';

// In logger.js create an Express Middleware function which logs the following for all the incoming requests:
//   Current date
// Request method like: GET, POST or PUT
// Request url like: /api/notes

function logger(req, res, next) {
  const now = new Date();
  console.log(
    `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
}

module.exports = { logger };