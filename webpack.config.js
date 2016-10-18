var path = require('path');
var webpack = require('webpack');
var OfflinePlugin = require('offline-plugin');

var config = require("./webpack-base.config.js");
config.plugins.push(new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(false),
  "process.env": {
    NODE_ENV: JSON.stringify("development")
  }
}))

delete(config.devtool)

module.exports = config
