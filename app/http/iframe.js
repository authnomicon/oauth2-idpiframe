exports = module.exports = function(js) {
  var express = require('express');
  var path = require('path');
  
  var iframe = path.join(__dirname, '../../../www/iframe.html');
  
  
  var router = new express.Router();
  
  router.get('/', function(req, res, next) {
    res.sendFile(iframe);
  });
  
  router.use('/js', js);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/idpiframe/http/IFrameService';
exports['@require'] = [ './handlers/assets/js' ];
