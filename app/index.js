exports = module.exports = {
  'implicit/grant': require('./implicit/grant'),
  'ext/modes/iframerpc': require('./ext/modes/iframerpc')
};

// http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20140630/004789.html

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
