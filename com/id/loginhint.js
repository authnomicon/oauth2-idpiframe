exports = module.exports = function(C) {
  
  return C.create('http://i.authnomicon.org/oauth2/idpiframe/LoginHintService')
    .catch(function(error) {
      if (error.code == 'IMPLEMENTATION_NOT_FOUND' && error.interface == 'http://i.authnomicon.org/oauth2/idpiframe/LoginHintService') {
        return C.create('./loginhint/default');
      }
      
      throw error;
    });
};

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
];
