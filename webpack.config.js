const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;
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
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
    loaders: [
      { test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, loader: 'file' },
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

if (ENV === 'test' || ENV === 'test-watch') {
  config.entry = void 0;
  config.output = {};
  config.devtool = 'eval-source-map';
  config.plugins = [];
} else if (ENV === 'build') {
  config.devtool = 'inline-source-map';
}

module.exports = config;
