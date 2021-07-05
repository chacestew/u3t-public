const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const { loaders } = require('./helpers');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  entry: {
    main: ['webpack-hot-middleware/client', path.resolve(process.cwd(), 'src/index.tsx')],
  },
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: 'js/[name].js',
    publicPath: '/',
  },
  module: {
    rules: [loaders.JS({ cacheDirectory: true }), loaders.Images()],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({ template: '/public/index.ejs' }),
    new CopyPlugin({
      patterns: [{ from: 'public', to: '.', filter: (f) => !f.includes('index.ejs') }],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({ overlay: { sockIntegration: 'whm' } }),
  ],
};
