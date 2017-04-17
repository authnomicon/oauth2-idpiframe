console.log('IFRAME MAIN!');

require.config({
  baseUrl: 'js/lib',
  paths: {
    //'idpiframe': 'github/jaredhanson/idpiframe@0.0.0/main',
    //'querystring': 'github/anchorjs/querystring@0.0.1/querystring',
  },
  packages: [
    { name: 'idpiframe', location: 'idpiframe' },
    //{ name: 'querystring', location: 'github/anchorjs/querystring@0.0.1', main: 'querystring' }
  ]
});

require(['idpiframe'], function (idpiframe) {
  idpiframe.start();
});
