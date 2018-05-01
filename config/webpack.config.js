const path = require('path');
const webpack = require('webpack');
const configs = ['opossum', 'opossum.min', 'browser-test']
  .map(key => generateConfig(key));

// add a webpack for tests
configs.push({
  target: 'web',
  mode: 'development',
  entry: './test/browser/index.js',
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(__dirname, '..', 'test', 'browser'),
    filename: 'webpack-test.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.js']
  }
});

function generateConfig (name) {
  const mode = name.indexOf('min') > -1 ? 'production' : 'development';
  const config = {
    mode,
    entry: {
      circuitBreaker: './index.js'
    },
    output: {
      path: path.resolve(__dirname, '..', 'dist'),
      filename: `${name}.js`,
      sourceMapFilename: `${name}.map`,
      library: 'circuitBreaker',
      libraryTarget: 'umd'
    },
    node: {
      process: true,
      console: true
    },
    plugins: [
      new webpack.ProvidePlugin({
        'circuitBreaker': 'opossum'
      })
    ],
    devtool: 'source-map'
  };
  return config;
}

module.exports = configs;
