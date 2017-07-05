const path = require('path');
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, { publicPath: webpackConfig.output.publicPath }));
}
app.use(express.static(path.resolve(__dirname, '/client')));

const store = {
  test: 1,
};

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./build/index.html'));
});

app.get('/client.js', (req, res) => {
  res.sendFile(path.resolve('./build/client.js'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('status', store);
  socket.on('setStore', (data) => {
    store.test = data;
    console.log(store);
  });
});

http.listen(8080, () => {
  console.log('Server running on http://localhost:8080...');
});
