// Module dependencies.
var express = require('express');

exports = module.exports = function(rpcRouter) {
  var router = express.Router();
  router.get('/', rpcRouter.handle.bind(rpcRouter));
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/oauth2/iframerpc';
exports['@require'] = [
  './rpc'
];
