const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  output: {
    publicPath: '/js/',
    filename: 'origo.js',
    library: {
      type: 'var',
      export: 'default',
      name: 'Origo'
    }
  },
  watchOptions: {
    ignored: [
      '**/node_modules',
      '**/dist',
      '**/build',
      '**/.git',
      '**/.cache',
      '**/tmp'
    ]
  },
  devServer: {
    static: {
      directory: './'
    },
    port: 9966,
    liveReload: false,
    hot: false,
    client: {
      webSocketURL: 'ws://localhost:9966/ws'
    }
  },
  devtool: 'eval-cheap-source-map'
});
