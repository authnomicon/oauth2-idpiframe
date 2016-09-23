exports = module.exports = function() {
  
  return function issuePermission(client, user, ares, areq, locals, cb) {
    return cb(null, 'A-LOGIN-HINT')
  };
};

exports['@require'] = [];
