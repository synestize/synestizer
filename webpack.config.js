const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isGallery = env.gallery === true;

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          loader: 'worker-loader'
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(isProduction),
        GALLERY: JSON.stringify(isGallery),
        EDITION: JSON.stringify('Blue'),
        VERSION: JSON.stringify('0.5.0-modern'),
        SIGNAL_PERIOD_MS: JSON.stringify(40),
        UI_PERIOD_MS: JSON.stringify(100),
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, '/'),
      },
      compress: true,
      port: 8080,
      hot: true,
    },
  };
};