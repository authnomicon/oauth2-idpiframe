// Module dependencies.
var express = require('express');

exports = module.exports = function(rpcHandler) {
  var router = express.Router();
  router.get('/', rpcHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/iframerpc';
exports['@require'] = [
  './handlers/rpc'
];
