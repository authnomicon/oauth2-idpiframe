exports = module.exports = function() {
  var url = require('url');
  
  // http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20151116/005865.html
  
  return function(redirectURI) {
    var uri = url.parse(redirectURI);
    var ruri = {
      protocol: uri.hostname + ':',
      host: uri.pathname.slice(1),
      slashes: true
    };
    
    return url.format(ruri);
  };
};

exports['@implements'] = 'module:@authnomicon/oauth2.resolveRedirectURISchemeFn';
exports['@scheme'] = 'storagerelay';
