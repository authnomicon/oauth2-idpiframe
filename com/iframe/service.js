// Module dependencies.
var express = require('express');
var path = require('path');

exports = module.exports = function() {
  var router = express.Router();
  //router.use(express.static(path.resolve(__dirname, 'public')));
  router.use(express.static(path.resolve(__dirname, '../../www')));
  router.use('/js/lib', express.static(path.join(__dirname, '../../www/node_modules')));
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/iframe';
