exports = module.exports = function() {
  var express = require('express');
  var path = require('path');
  
  var router = new express.Router();
  router.use(express.static(path.resolve(__dirname, 'public')));
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/iframe';
