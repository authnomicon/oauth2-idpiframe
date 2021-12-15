exports = module.exports = function() {
  var url = require('url');
  
  // http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20151116/005865.html
  
  return {
    verify: function(client, redirectURI) {
      var uri = url.parse(redirectURI);
      var wo = {
        protocol: uri.hostname + ':',
        host: uri.pathname.slice(1),
        slashes: true
      };
      
      var origin = url.format(wo);
      if (!client.webOrigins || client.webOrigins.indexOf(origin) == -1) {
        return false;
      }
      return [ redirectURI, origin ];
    }
  };
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme';
exports['@scheme'] = 'storagerelay';
exports['@require'] = [];
