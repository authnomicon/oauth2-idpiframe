exports = module.exports = function(issueTokenHandler, listSessionsHandler) {
  var express = require('express');
  var router = new express.Router();
  
  // TODO: Collapse these into a single /iframerpc route (Google style)
  
  router.get('/listSessions', issueTokenHandler);
  router.get('/issueToken', listSessionsHandler);
  
  return router;
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/idpiframe/http/RPCService';
exports['@require'] = [
  './handlers/rpc/issuetoken',
  './handlers/rpc/listsessions'
];
