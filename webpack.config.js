var path = require('path');

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
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules(?!\/rxjs))/,
      loader: 'babel',
      query: {
        cacheDirectory: '/tmp',
        "presets": [ "es2015", "react" ],
        "plugins": ["transform-object-rest-spread", "transform-function-bind" ]
      }
    }]
  },
  resolve: {
    modulesDirectories: [path.join(__dirname, 'src'), 'node_modules']
  }
};
