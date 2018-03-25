const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  entry: {
    main: [
      './index.js'
    ]
  },
  mode: 'production',
  output: {
    filename: 'opossum.js'
  },
  plugins: [
    new MinifyPlugin()
  ]
};
