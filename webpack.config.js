var path = require('path');
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
    // it always better if OfflinePlugin is the last plugin added
    new OfflinePlugin({
      publicPath: '/js/',
      externals: [
        '/css/normalize.css',
        '/css/font-awesome.css',
        '/css/style.css',
        '/index.html'
      ],
      relativePaths: false,
      AppCache: false,
      ServiceWorker: {
        output: '/sw.js',
        navigateFallbackURL: '/index.html'
      }
    })
  ]
};
