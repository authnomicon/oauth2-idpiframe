exports = module.exports = function() {
  
  return {
    generate: function(msg, cb) {
      return cb(null, 'A-LOGIN-HINT');
    }
  };
};

exports['@singleton'] = true;
exports['@require'] = [];
