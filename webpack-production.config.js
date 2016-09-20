var path = require('path');
var webpack = require('webpack');
var OfflinePlugin = require('offline-plugin');

module.exports = {
  entry: [
    //'webpack/hot/dev-server' ,
    './src/index.js'
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, ''),
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
          // "escompress"
        ],
        "plugins": [
          "transform-object-rest-spread",
          "transform-function-bind",
          "transform-dead-code-elimination"
        ]
      }
    }]
  },
  resolve: {
    modulesDirectories: [path.join(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    // Note sure that this one is necessary. see
    // https://github.com/webpack/docs/wiki/list-of-plugins#environmentplugin
    // new webpack.EnvironmentPlugin([
    //   "NODE_ENV"
    // ]),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true)
    }),
    // it always better if OfflinePlugin is the last plugin added
    new OfflinePlugin({
      publicPath: '/',
      externals: [
        '/css/normalize.css',
        '/css/font-awesome.css',
        '/css/style.css',
        '/index.html'
      ],
      rewrites: {
        '/': '/index.html'
      },
      relativePaths: false,
      AppCache: false,
      ServiceWorker: {
        events: true,
        output: 'sw.js',
      }
    })
  ]
};
