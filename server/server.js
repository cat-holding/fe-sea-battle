const path = require('path');
const express = require('express');
const engines = require('consolidate');

const app = express();
const http = require('http').Server(app);

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');

const GameRouter = require('./routers/game.router');

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, { publicPath: webpackConfig.output.publicPath }));
  app.use(express.static(path.resolve(__dirname, './../client')));
} else {
  app.set('views', path.resolve(__dirname, './../build'));
  app.engine('html', engines.mustache);
  app.set('view engine', 'html');

  app.use(express.static(path.resolve(__dirname, '../build')));
  app.get('/', (request, response) => {
    response.render('../build/index.html');
  });
}

app.set('port', (process.env.PORT || 8080));
new GameRouter(http);

http.listen(app.get('port'), () => {
  console.log(`Server running on http://localhost:${app.get('port')}...`);
});
