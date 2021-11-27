exports = module.exports = function() {
  var express = require('express');
  var path = require('path');
  
  
  var router = new express.Router();
  router.use(require('serve-static')(path.join(__dirname, '../../../../www/js')));
  router.use('/lib', require('serve-static')(path.join(__dirname, '../../../../www/node_modules')));
  return router;
};

exports['@require'] = [];
