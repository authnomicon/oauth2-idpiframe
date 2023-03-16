var oauth2orize = require('oauth2orize');

exports = module.exports = function(router) {
  
  function dispatch(req, res, next) {
    var action = req.query.action;
    if (!action) {
      return next(new oauth2orize.TokenError('No action specified!', 'invalid_request'));
    }
    
    router.dispatch(action, req, res, next)
  }
  
  
  return [
    dispatch,
    oauth2orize.errorHandler()
  ];
};

exports['@require'] = [
  '../actions/index'
];
