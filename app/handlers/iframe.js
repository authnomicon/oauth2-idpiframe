exports = module.exports = function(js) {
  var express = require('express');
  var path = require('path');
  
  var filename = path.join(__dirname, '../../www/iframe.html');
  
  
  var router = new express.Router();
  
  router.get('/', function(req, res, next) {
    res.sendFile(filename);
  });
  
  router.use('/js', js);
  
  return router;
};

exports['@require'] = [ './assets/js' ];
