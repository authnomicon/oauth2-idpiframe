var flatten = require('array-flatten')
  , slice = Array.prototype.slice;

function Router() {
  this.stack = [];
}

Router.prototype.use = function(handler) {
  var handles = flatten(slice.call(arguments, 0));
  this.stack.push({ stack: handles });
};

Router.prototype.action = function(name, handler) {
  var handles = flatten(slice.call(arguments, 1));
  this.stack.push({ action: name, stack: handles });
};

Router.prototype.handle = function(req, res, out) {
  var stack = this.stack;
  var i = 0;
  
  var action = req.query.action;
  
  next();
  
  function next(err) {
    var layer = stack[i++];
    if (!layer) {
      return out(err);
    }
    if (!layer.action || layer.action === action) {
      return dispatch(layer.stack)(err, req, res, next);
    }
    next(err);
  }
};

function dispatch(stack) {
  return function(err, req, res, next) {
    var i = 0;

    function callbacks(err) {
      var fn = stack[i++];
      try {
        if (err && fn) {
          if (fn.length < 4) return callbacks(err);
          fn(err, req, res, callbacks);
        } else if (fn) {
          if (fn.length < 4) return fn(req, res, callbacks);
          callbacks();
        } else {
          next(err);
        }
      } catch (err) {
        callbacks(err);
      }
    }
    callbacks(err);
  }
}

module.exports = Router;
