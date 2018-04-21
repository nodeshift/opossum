const path = require('path');
const configs = ['opossum', 'opossum.min', 'browser-test']
  .map(key => generateConfig(key));

// add a webpack for tests
configs.push({
  target: 'web',
  mode: 'development',
  entry: './test/test.js',
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
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, '..', 'dist'),
      filename: `${name}.js`,
      sourceMapFilename: `${name}.map`,
      library: 'opossum',
      libraryTarget: 'umd'
    },
    node: {
      process: false,
      console: true
    },
    devtool: 'source-map'
  };
  return config;
}

module.exports = configs;
