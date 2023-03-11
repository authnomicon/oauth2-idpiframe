exports = module.exports = function() {
  
  return {
    generate: function(user, client, cb) {
      // TODO: make pairwise identifiers (based on OpenID sector?  or origin?)
      // https://github.com/mozilla/fxa/blob/main/packages/fxa-auth-server/docs/oauth/pairwise-pseudonymous-identifiers.md
      // https://connect2id.com/products/server/docs/guides/pairwise-subject-identifiers
      // https://curity.io/resources/learn/ppid-intro/
      
      return cb(null, user.id);
    }
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
