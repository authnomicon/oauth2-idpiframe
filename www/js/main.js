require.config({
  baseUrl: 'js/lib',
  packages: [
    { name: 'idpiframe', location: 'idpiframe' },
    { name: 'querystring', location: 'querystring', main: 'querystring' }
  ]
});

require(['idpiframe'], function (idpiframe) {
  idpiframe.start();
});
