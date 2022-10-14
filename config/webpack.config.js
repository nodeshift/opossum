const path = require('path');
const webpack = require('webpack');
const configs = ['opossum', 'opossum.min']
  .map(key => generateConfig(key));

// add a webpack for tests
configs.push({
  target: 'web',
  mode: 'development',
  entry: './test/browser/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'test', 'browser'),
    filename: 'webpack-test.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.js'],
    fallback: { 
      fs: false, 
      path: false,
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        WEB: JSON.stringify('web')
      }
    })
  ]
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
    resolve: {
      fallback: { 
        fs: false,
        console: false
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        'circuitBreaker': 'opossum'
      }),
      new webpack.DefinePlugin({
        'process.env': {
          WEB: JSON.stringify('web')
        }
      })
    ],
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
  return config;
}

module.exports = configs;

