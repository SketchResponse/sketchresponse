/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
    new CopyPlugin([
      { from: './index.html' },
      { from: './favicon.ico' },
      { from: './debugConfigs.js' },
      { from: './lib/delete-icon.svg', to: './lib/delete-icon.svg' },
      { from: './lib/redo-icon.svg', to: './lib/redo-icon.svg' },
      { from: './lib/select-icon.svg', to: './lib/select-icon.svg' },
      { from: './lib/undo-icon.svg', to: './lib/undo-icon.svg' },
      { from: './lib/undo-icon.svg', to: './lib/undo-icon.svg' },
      { from: './lib/plugins/stamp/stamp-icon.svg', to: './lib/plugins/stamp/stamp-icon.svg' },
      { from: './lib/plugins/stamp/stamp.svg', to: './lib/plugins/stamp/stamp.svg' },
    ]),
    new ReplaceInFileWebpackPlugin([{
      dir: '../static/sketch_tool_dist/',
      files: ['index.html'],
      rules: [{
          search: '<!-- Insert production css -->',
          replace: '<link rel="stylesheet" href="application.min.css">',
      }],
    }]),
  ],
});
