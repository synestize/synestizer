var path = require('path');
var webpack = require('webpack');

var config = require("./webpack-base.config.js");
config.plugins.push(new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(false),
  GALLERY: JSON.stringify(false),
  "process.env": {
    NODE_ENV: JSON.stringify("development")
  },
  SIGNAL_PERIOD_MS: JSON.stringify(100),
  UI_PERIOD_MS: JSON.stringify(100),
}))

module.exports = config
