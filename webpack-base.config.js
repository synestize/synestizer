var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    //'webpack/hot/dev-server' ,
    './src/index.js'
  ],
  output: {
    publicPath: 'js/',
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
    new webpack.DefinePlugin({
      EDITION: JSON.stringify("Blue"),
      VERSION: JSON.stringify("0.4.0beta0"),
    })
  ]
};
