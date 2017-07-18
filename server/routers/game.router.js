const socketIo = require('socket.io');
const storage = require('./../storage/game.storage');
const auth = require('./../services/auth.service');
const disconnecting = require('./../services/discon.service');
const game = require('./../services/game.service');
const selectGame = require('./../services/selectGame.service');

let io;

class GameRouter {
  constructor(http) {
    io = socketIo(http);
    io.on('connection', this.onConnection.bind(this));
  }

  onConnection(socket) {
    const ns = { socket };

    socket.on('login', this.onLogin.bind(ns));
    socket.on('list', GameRouter.refreshList);
    socket.on('newGame', this.onNewGame.bind(ns));
    socket.on('connectToGame', this.onConnectToGame.bind(ns));
    socket.on('setShips', this.onSetShips.bind(ns));
    socket.on('attackCell', this.onAttackCell.bind(ns));
    socket.on('disconnecting', this.onDisconnecting.bind(ns));
  }

  static refreshList(idSocket) {
    const list = selectGame.getListGames(storage.games, storage.users);

    if (typeof idSocket === 'string' && idSocket.length > 0) {
      io.to(idSocket).emit('list', list);
    } else {
      io.sockets.emit('list', list);
    }
  }

  onLogin(data, fn) {
    auth.addUser(this.socket.id, data, storage.users)
      .then((result) => {
        fn(result);
      }, (error) => { fn(error.message); });
  }

  onList() {
    GameRouter.refreshList(this.socket.id);
  }

  onNewGame(data) {
    game.createGame(this.socket.id, data, storage.games, storage.users)
      .then(
      () => {
        GameRouter.refreshList();
      }).catch((err) => { console.log(err); });
  }

  onConnectToGame(idGame) {
    selectGame.connectToGame(idGame, this.socket.id, storage.users, storage.games)
      .then(() => {
        const users = game.getGame(idGame, storage.games).users;

        io.to(users[0]).to(users[1]).emit('game', selectGame.getSettingsGame(idGame, storage.games));
        GameRouter.refreshList();
      }, (error) => {
        console.log(error);
      });
  }

  onSetShips(data, fn) {
    if (game.setShips(this.socket.id, data, storage.games)) {
      fn(true);
    } else {
      fn(false);
    }
  }

  onAttackCell(data, fn) {
    game.attackCell(this.socket.id, data, storage.games, storage.users)
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
                game.getIdGame(this.socket.id, storage.games), storage.games));
          const score = `${resultsGame[this.socket.id]}:${resultsGame[res.enemy]}`;

          io.to(this.socket.id).emit('resGame', {
            victory: resultsGame[this.socket.id] > resultsGame[res.enemy],
            score,
          });
          io.to(res.enemy).emit(
            'resGame', {
              victory: resultsGame[this.socket.id] < resultsGame[res.enemy],
              score,
            });
        }
      })
      .catch((error) => { console.log(error); });
  }

  onDisconnecting() {
    disconnecting.delUser(this.socket.id, storage.users);

    const user = disconnecting.delGame(this.socket.id, storage.games);

    if (typeof user === 'string') {
      io.to(user).emit('errorCode', 4);
    } else if (user === true) {
      GameRouter.refreshList();
    }
  }
}

module.exports = GameRouter;
