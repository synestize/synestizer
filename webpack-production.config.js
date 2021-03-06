var path = require('path');
var webpack = require('webpack');

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

delete(config.devtool)

module.exports = config
