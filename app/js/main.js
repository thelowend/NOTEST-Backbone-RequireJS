
require.config({
  paths: {
    "jquery": 'libs/jquery/dist/jquery.min',
    "underscore": 'libs/underscore-amd/underscore-min',
    "backbone": 'libs/backbone-amd/backbone-min'
  }
});

require(['views/home'], function (HomeView) {
  new HomeView;
});