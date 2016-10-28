var path = require('path');
var webpack = require('webpack');
var OfflinePlugin = require('offline-plugin');

var config = require("./webpack-base.config.js");
config.plugins.push(new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  GALLERY: JSON.stringify(true),
  "process.env": {
    NODE_ENV: JSON.stringify("production")
  },
  EDITION: JSON.stringify("Violet"),
  VERSION: JSON.stringify("0.3.0"),
  SIGNAL_PERIOD_MS: JSON.stringify(40),
  UI_PERIOD_MS: JSON.stringify(100),
}))

delete(config.devtool)

module.exports = config
