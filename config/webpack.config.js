const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  entry: {
    main: [
      './index.js' 
    ]
  },
  output: {
    filename: 'dist/opossum.js'
  },
  plugins: [
    new MinifyPlugin()
  ]
}