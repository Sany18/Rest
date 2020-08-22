const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const fs = require('fs')

const workDir = path.resolve(__dirname, '../src')
const dist = path.resolve(__dirname, '../dist')

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
    path: dist
  },
  resolve: {
    extensions: ['.js', '.json', 'css', 'scss'],
    alias: {
      src: workDir,
      ...fs.readdirSync(workDir, { withFileTypes: true })
           .filter(dirent => dirent.isDirectory())
           .reduce((acc, file) => ({ ...acc, [file.name]: path.join(workDir, file.name) }), {})
    }
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: [{ loader: 'babel-loader' }] },
      { test: /\.s[ac]ss$/i, use: [ 'style-loader', 'css-loader', 'sass-loader'] },
      // { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=./font/[name].[ext]' },
      { test: /\.(jpg|png)$/, loader: 'file-loader?name=./image/[name].[ext]' }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(workDir, 'index.html'),
      cache: false
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(workDir, 'public'), to: dist },
        { from: path.join(workDir, 'assets', 'textures'), to: dist + '/textures'  },
      ],
    }),
  ]
}
