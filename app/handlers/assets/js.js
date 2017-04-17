exports = module.exports = function() {
  var express = require('express');
  var path = require('path');
  
  var dirname = path.join(__dirname, '../../../www/js');
  
  return require('serve-static')(dirname);
};

exports['@require'] = [];
