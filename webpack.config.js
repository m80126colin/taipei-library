const path = require('path');

const resolve = function(dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  context: resolve('src'),
  entry: './index.es6',
  output: {
    path: resolve('dist'),
    filename: './index.bundle.js'
  },
  resolve: {
    extensions: ['.js', '.es6']
  },
  module: {
    rules: [
      {
        test: /\.(js|es6)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  }
}