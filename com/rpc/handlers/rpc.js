exports = module.exports = function(router) {
  
  function dispatch(req, res, next) {
    var action = req.query.action;
    // TODO: If no action, error
    
    router.dispatch(action, req, res, next)
  }
  
  
  return [
    dispatch
  ];
};

exports['@require'] = [
  '../actions/index'
];
