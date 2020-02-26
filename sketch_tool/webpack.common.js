const path = require('path');

module.exports = {
  entry: {
    application: './lib/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../static/sketch_tool_dist/'),
    filename: '[name].min.js',
    chunkFilename: '[name].min.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          'svg-inline-loader'
        ],
      },
      {
        test: /.js/,
        use: [
          {
            loader: `expose-loader`,
            options: 'SketchInput'
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 0,
      cacheGroups: {
        vendors: {
            test: /node_modules/,
            name: 'vendors'
        }
      },
    }
  }
};
