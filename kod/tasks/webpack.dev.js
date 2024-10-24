const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  output: {
    publicPath: '/js',
    filename: 'origo.js',
    library: {
      type: 'var',
      export: 'default',
      name: 'Origo'
    }
  },
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true
      }
    },
    static: {
      directory: './'
    },
    port: 9966
  },
  devtool: 'eval-cheap-source-map'
});
