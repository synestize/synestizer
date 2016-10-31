var path = require('path');
var webpack = require('webpack');
var OfflinePlugin = require('offline-plugin');

var config = require("./webpack-base.config.js");
config.plugins.push(new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  GALLERY: JSON.stringify(false),
  "process.env": {
    NODE_ENV: JSON.stringify("production")
  },
  SIGNAL_PERIOD_MS: JSON.stringify(40),
  UI_PERIOD_MS: JSON.stringify(100),
}))
// it always better if OfflinePlugin is the last plugin added
config.plugins.push(new OfflinePlugin({
  caches: 'all',
  scope: '/',
  updateStrategy: 'all',
  version: '0',
  externals: [
    '/css/normalize.css',
    '/css/font-awesome.css',
    '/css/style.css',
    '/index.html'
  ],
  relativePaths: false,
  AppCache: {
    events: true,
  },
  ServiceWorker: {
    events: true,
    // output: '/sw.js',
    navigateFallbackURL: '/index.html'
  }
}));

delete(config.devtool)

module.exports = config
