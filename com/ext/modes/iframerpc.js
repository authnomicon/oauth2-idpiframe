exports = module.exports = function() {
  return require('oauth2orize-iframerpcrm');
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/responseMode';
exports['@mode'] = '.iframe-rpc+json';
