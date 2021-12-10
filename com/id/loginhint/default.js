exports = module.exports = function() {
  
  return {
    generate: function(id, client, cb) {
      // TODO: make pairwise identifiers (based on OpenID sector?  or origin?)
      
      return cb(null, id);
    }
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
