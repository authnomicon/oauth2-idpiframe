function IFrameRPCError(message, code, status) {
  Error.call(this);
  this.message = message;
  this.code = code || 'server_error';
  this.status = status || 500;
}

IFrameRPCError.prototype.__proto__ = Error.prototype;


module.exports = IFrameRPCError;
