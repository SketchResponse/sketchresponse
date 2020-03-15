/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: {
    application: './lib/main.js',
  },
  output: {
    path: path.resolve(__dirname, '../static/sketch_tool_dist/'),
    filename: '[name].min.js',
    chunkFilename: '[name].min.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'expose-loader',
            options: 'SketchInput',
          },
          {
            loader: 'eslint-loader',
            options: {
              cache: true,
              failOnError: true,
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: 'raw-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        vendors: {
            test: /node_modules/,
            name: 'vendors',
        },
      },
    },
  },
  plugins: [new StylelintPlugin()],
};
