require('dotenv').config();

const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  node: {
    fs: 'empty',
  },
  output:  {
    filename: 'bundle.[hash].js',
    path: `${__dirname}/build`,
  },
  entry: `${__dirname}/src/index.js`, 
  devtool: 'cheap-eval-source-map',
  plugins: [
    new HTMLPlugin({
      template: `${__dirname}/src/index.html`,
    }),
    new webpack.DefinePlugin({
      UI_PORT: JSON.stringify(process.env.UI_PORT) || 8080,
      API_PORT: JSON.stringify(process.env.API_PORT) || 4040,
      API_URL: JSON.stringify(process.env.API_URL) || 'localhost'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ], 
  }
}

