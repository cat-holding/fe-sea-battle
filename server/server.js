const path = require('path');
const express = require('express');

const app = express();
const http = require('http').Server(app);

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');

const GameRouter = require('./routers/game.router');

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, { publicPath: webpackConfig.output.publicPath }));
}

app.use(express.static(path.resolve(__dirname, './../client')));

const gameRouter = new GameRouter(http);

http.listen(8080, () => {
  console.log('Server running on http://localhost:8080...');
});
