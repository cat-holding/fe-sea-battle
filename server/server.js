const path = require('path');
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');

const storage = require('./storage/game.storage');
const auth = require('./services/auth.service');
const disconnecting = require('./services/discon.service');
const game = require('./services/game.service');
const selectGame = require('./services/selectGame.service');

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, { publicPath: webpackConfig.output.publicPath }));
}

app.use(express.static(path.resolve(__dirname, './../client')));

const refreshList = (idSocket) => {
  const list = selectGame.getListGames(storage.games, storage.users);

  if (typeof idSocket === 'string' && idSocket.length > 0) {
    io.to(idSocket).emit('list', list);
  } else {
    io.sockets.emit('list', list);
  }
};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('login', (data, fn) => {
    auth.addUser(socket.id, data, storage.users)
      .then((result) => {
        fn(result);
      }, (error) => { fn(error.message); });
  });

  socket.on('list', () => {
    refreshList(socket.id);
  });

  socket.on('newGame', (data) => {
    game.createGame(socket.id, data, storage.games, storage.users)
      .then(
      () => {
        refreshList();
      }).catch((err) => { console.log(err); });
  });

  socket.on('connectToGame', (idGame) => {
    selectGame.connectToGame(idGame, socket.id, storage.users, storage.games)
      .then(() => {
        const users = game.getGame(idGame, storage.games).users;

        io.to(users[0]).to(users[1]).emit('game', selectGame.getSettingsGame(idGame, storage.games));
        refreshList();
      }, (error) => {
        console.log(error);
      });
  });

  socket.on('setShips', (data, fn) => {
    if (game.setShips(socket.id, data, storage.games)) {
      fn(true);
    } else {
      fn(false);
    }
  });

  socket.on('attackCell', (data, fn) => {
    game.attackCell(socket.id, data, storage.games, storage.users)
      .then((res) => {
        fn(res.result);

        console.log('====> ', Array.isArray(res.stateShips), JSON.stringify(res.stateShips));

        if (Array.isArray(res.stateShips)) {
          io.to(res.enemy).emit('ships', res.stateShips);
        }

        if (res.allShipsDestroyed === true) {
          const resultsGame =
            game.getResultsGame(
              game.getGame(
                game.getIdGame(socket.id, storage.games), storage.games));
          const score = `${resultsGame[socket.id]}:${resultsGame[res.enemy]}`;

          io.to(socket.id).emit('resGame', {
            victory: resultsGame[socket.id] > resultsGame[res.enemy],
            score,
          });
          io.to(res.enemy).emit(
            'resGame', {
              victory: resultsGame[socket.id] < resultsGame[res.enemy],
              score,
            });
        }
      })
      .catch((error) => { console.log(error); });
  });

  socket.on('disconnecting', () => {
    if (disconnecting.delUser(socket.id, storage.users)) {
      console.log('The user has been deleted: ' + JSON.stringify(storage.users));
    }

    const user = disconnecting.delGame(socket.id, storage.games);

    if (typeof user === 'string') {
      io.to(user).emit('errorCode', 4);
    } else if (user === true) {
      refreshList();
    }
  });
});

http.listen(8080, () => {
  console.log('Server running on http://localhost:8080...');
});
