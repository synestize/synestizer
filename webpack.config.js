var path = require('path');
var webpack = require('webpack');
var OfflinePlugin = require('offline-plugin');

var config = require("./webpack-base.config.js");
config.plugins.push(new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(false),
  GALLERY: JSON.stringify(false),
  "process.env": {
    NODE_ENV: JSON.stringify("development")
  },
  SIGNAL_PERIOD_MS: JSON.stringify(1000),
  UI_PERIOD_MS: JSON.stringify(1000),
}))

module.exports = config
