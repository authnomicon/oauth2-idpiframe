exports = module.exports = function(router) {
  
  function handle(req, res, next) {
    router.handle(req, res, next);
  }
  
  
  return [
    handle
  ];
};

exports['@require'] = [
  '../router'
];
