exports = module.exports = function() {
  
  
  function go(req, res, next) {
    console.log('CHECK ORIGIN')
    console.log(req.query);
    console.log(req.user);
  }
  
  
  return [
    go
  ];
};

exports['@action'] = 'checkOrigin';
exports['@require'] = [
];
