const webpack = require('webpack');

module.exports = {
  entry: [
    'core-js/stable',
    './origo.js'
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  plugins: [
    new webpack.ProvidePlugin({
      proj4: 'proj4'
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  }
};
