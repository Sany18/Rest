const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const fs = require('fs')

module.exports = {
  mode: 'development',
  watch: true,
  stats: 'errors-only',
  devtool: 'inline-source-map',
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.js', '.json', 'css', 'scss'],
    alias: {
      src: path.resolve(__dirname, '../src/'),
      ...fs.readdirSync(path.resolve(__dirname, '../src'), { withFileTypes: true })
           .filter(dirent => dirent.isDirectory())
           .reduce((acc, file) => ({ ...acc, [file.name]: path.join(__dirname, '../src', file.name) }), {})
    }
  },
  module: {
    rules: [
      // { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
      // { test: /\.css$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader'] }) },
      // { test: /\.scss$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader'] }) },
      // { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=./font/[name].[ext]' },
      // { test: /\.(jpg|png)$/, loader: 'file-loader?name=./image/[name].[ext]' }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      cache: false
    })
  ]
}
