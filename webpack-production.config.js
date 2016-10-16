var path = require('path');
var webpack = require('webpack');
var OfflinePlugin = require('offline-plugin');

module.exports = {
  entry: [
    //'webpack/hot/dev-server' ,
    './src/index.js'
  ],
  output: {
    publicPath: '/js/',
    path: path.join(__dirname, 'js'),
    filename: 'bundle.js'
  },
  devtool: 'eval',
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'source-map-loader'
      }
    ],
    noParse: /node_modules\/localforage\/dist\/localforage.js/,
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        cacheDirectory: '/tmp',
        "presets": [
          "es2015",
          "react",
          "stage-0",
          // "escompress"
        ],
        "plugins": [
          // "transform-es2015-destructuring",
          // // "transform-es2015-spread",
          // "transform-dead-code-elimination",
          // "transform-object-rest-spread",
          "transform-class-properties",
        ]
      }
    }]
  },
  resolve: {
    modulesDirectories: [path.join(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    // Not sure that this one is necessary. see
    // https://github.com/webpack/docs/wiki/list-of-plugins#environmentplugin
    // new webpack.EnvironmentPlugin([
    //   "NODE_ENV"
    // ]),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true)
    }),
  ]
};
