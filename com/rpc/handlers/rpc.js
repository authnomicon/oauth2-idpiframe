var oauth2orize = require('oauth2orize');

exports = module.exports = function(router) {
  
  function validate(req, res, next) {
    var action = req.query.action;
    if (!action) {
      return next(new oauth2orize.TokenError('No action specified!', 'invalid_request'));
    }
    next();
  }
  
  function dispatch(req, res, next) {
    router.handle(req, res, next);
  }
  
  
  return [
    validate,
    dispatch,
    oauth2orize.errorHandler()
  ];
};

exports['@require'] = [
  '../actions/index'
];
