exports = module.exports = function() {
  
  return {
    generate: function(id, client, cb) {
      return cb(null, 'A-LOGIN-HINT');
    }
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
