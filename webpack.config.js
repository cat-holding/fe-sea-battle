const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    client: './client/app',
  },
  output: {
    path: path.resolve(__dirname, 'build'), // string
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'client'),
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        options: {
          presets: ['es2015'],
        },
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'client'),
    ],
    extensions: ['.js', '.json', '.css'],
  },
  context: __dirname,
  plugins: [new HtmlWebpackPlugin({
    title: 'sea-battle',
    template: 'client/template.html',
  })],
  devtool: 'eval-source-map',
};

module.exports = config;
