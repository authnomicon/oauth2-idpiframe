exports = module.exports = function() {
  return require('oauth2orize-iframerpcrm');
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/response/mode';
exports['@mode'] = '.iframe-rpc+json';
