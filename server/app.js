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

app.use(express.static(path.resolve(__dirname, './../client')));

// { idGame: socket.id,
//   currUser: 0,
//   users: [socket.id, socket.id],
//   settings: {
//     gridSize: 10,
//     ships: {
//       4: 1,
//       3: 2,
//       2: 3,
//       1: 4,
//     }
//   },
//   maps: {
//     user1: [[]],
//     user2: [[]],
//   },
//   ships: {
//     user1: [],
//     user2: [],
//   }
// }
const store = {
  users: [], // { id: socket.id, nickname: String }
  games: [],
};

// Получить nickName пользователя
const getNickname = (socketId) => {
  let nickname = null;

  store.users.some((el) => {
    if (el.id === socketId) {
      nickname = el.nickname;

      return true;
    }

    return false;
  });

  return nickname;
};

// Проверить корректность имени пользователя
const isValidNickName = nickname => /^[0-9a-zA-Zа-яА-Я ]{3,20}$/.test(nickname);


// Удаляет пользователя из списка авторизованных
const delUser = (socketId) => {
  if (typeof socketId !== 'string') {
    throw new Error('Incorrect value of the variable "socketId"!');
  }

  if (!Array.isArray(store.users)) {
    throw new Error('The "store.users" is not an Array!');
  }

  return store.users.some((el, i, users) => {
    if (el.id === socketId) {
      users.splice(i, 1);

      return true;
    }

    return false;
  });
};

// Проверяет, авторизован ли пользователь
const isUserLogged = (idUser) => {
  if (!Array.isArray(store.users)) {
    throw new Error('The "store.users" is not an Array!');
  }

  return store.users.some(el => el.id === idUser);
};


// Добавляет пользователя в список авторизованных
const addUser = (socketId, nickname) => {
  if (typeof socketId !== 'string') {
    throw new Error('Incorrect value of the variable "socketId"!');
  }

  if (!Array.isArray(store.users)) {
    throw new Error('The "store.users" is not an Array!');
  }

  if (!isValidNickName(nickname)) {
    return false;
  }
  console.log(store.users);

  return store.users.push({
    id: socketId,
    nickname,
  }) - 1;
};

const getIndexGame = (idGame) => {
  if (!Array.isArray(store.games)) {
    throw new Error('The "store.games" is not an Array!');
  }

  if (typeof idGame !== 'string') {
    throw new Error('Incorrect value of the variable "idGame"!');
  }

  let index = -1;

  store.games.some((el, i) => {
    if (el.idGame === idGame) {
      index = i;
      return true;
    }

    return false;
  });

  return index;
};

// проверяет, находится ли игра в режиме ожидания
const isGameWaiting = (index) => {
  let _index = index;

  if (!Array.isArray(store.games)) {
    throw new Error('The "store.games" is not an Array!');
  }

  if (typeof _index === 'string') {
    _index = getIndexGame(index);
  }

  if (_index >= 0 && _index < store.games.length) {
    return store.games[_index].users.length === 1;
  }

  return false;
};

// вернуть список с доступными играми
const getListGames = () => {
  if (!Array.isArray(store.games)) {
    throw new Error('The "store.games" is not an Array!');
  }

  const res = [];

  store.games.forEach((el, i) => {
    if (isGameWaiting(i)) {
      res.push({
        idGame: el.idGame,
        nickname: getNickname(el.idGame),
        gridSize: el.settings.gridSize,
        ships: el.settings.ships,
      });
    }
  });

  return res;
};

const getSettingsGame = (gameId) => {
  const index = getIndexGame(gameId);

  return index !== -1 ? store.games[index].settings : null;
};

const getUsersGame = (gameId) => {
  const index = getIndexGame(gameId);

  return index !== -1 ? store.games[index].users : null;
};

const getGame = (gameId) => {
  let obj = null;

  store.games.some((game) => {
    if (game.idGame === gameId) {
      obj = game;

      return true;
    }

    return false;
  });

  return obj;
};

// Проверить играет ли пользователь
const isUserPlaying = socketId => store.games.some(el => el.users.indexOf(socketId) !== -1);

const getIdGame = (socketId) => {
  let gameId = null;

  store.games.some((game) => {
    if (game.users.indexOf(socketId) !== -1) {
      gameId = game.idGame;

      return true;
    }

    return false;
  });

  return gameId;
};

const isShipsAdded = (gameId) => {
  const game = getGame(gameId);
  const keys = Object.keys(game.ships);

  if (keys.length === 2) {
    return keys.every(socketId => Array.isArray(game.ships[socketId]) &&
      game.ships[socketId].length > 0);
  }

  return false;
};

const isCurrentUserGame = (gameId, socketId) => getGame(gameId).currUser === socketId;

// Проверить корректность переданных настроек игры
const isValidSettinsGame = (settings) => {
  if (settings.gridSize >= 10 && settings.gridSize <= 20 && settings.gridSize % 1 === 0) {
    return Object.keys(settings.ships).every(i =>
      settings.ships[i] > 0 && settings.ships[i] <= 10 && settings.ships[i] % 1 === 0);
  }

  return false;
};

// Создать игру
const createGame = (socketId, settings) => {
  if (!Array.isArray(store.games)) {
    throw new Error('The "store.games" is not an Array!');
  }
  console.log(isValidSettinsGame(settings), isUserLogged(socketId), !isUserPlaying(socketId));
  if (isValidSettinsGame(settings)) {
    // Если пользователь авторизован и не играет в играх
    if (isUserLogged(socketId) && !isUserPlaying(socketId)) {
      store.games.push({
        idGame: socketId,
        currUser: socketId,
        users: [socketId],
        settings: {
          gridSize: settings.gridSize,
          ships: settings.ships,
        },
        maps: {
          // socketId: null,
        },
        ships: {
          // socketId: null,
        },
      });

      return true;
    }
  }

  return false;
};

// Удаляет игру с указанным пользователем и
// возвращает другого пользователя(если есть), для оповещения.
// Использовать в случае разъединения соединения
const delGame = (socketId) => {
  if (!Array.isArray(store.games)) {
    throw new Error('The "store.games" is not an Array!');
  }

  let users = [];

  store.games.some((el, i) => {
    if (el.users.indexOf(socketId) !== -1) {
      users = el.users;
      store.games.splice(i, 1);

      return true;
    }

    return false;
  });

  return users.filter(el => el !== socketId)[0];
};

// подключить пользователя к игре
const connectToGame = (gameId, socketId) => {
  if (isUserLogged(socketId) && !isUserPlaying(socketId)) {
    const index = getIndexGame(gameId);

    if (index !== -1 && isGameWaiting(index)) {
      store.games[index].users.push(socketId);
      store.games[index].ships[socketId] = null;
      store.games[index].maps[socketId] = null;

      return true;
    }
  }

  return false;
};

// Проверяем нахождение координаты в координатной сетке
// const isValidPos = (pos, gridSize) => pos >= 0 && pos <= gridSize - 1 && pos % 1 === 0;

const isNaturalNumberOrZero = number => Number.isInteger(number) && number >= 0;

const createArray = (value = null, columns = 1, lines = 0) => {
  if (!isNaturalNumberOrZero(columns) || columns === 0) {
    throw new Error('Incorrect value of the variable "columns"!');
  }

  if (!isNaturalNumberOrZero(lines)) {
    throw new Error('Incorrect value of the variable "lines"!');
  }

  const resultArr = [];
  const arr = [];

  for (let i = 0; i < columns; i++) {
    arr[i] = value;
  }

  for (let i = 0; i < lines; i++) {
    resultArr.push(arr.slice());
  }

  return lines > 1 ? resultArr : arr;
};

// Устанавливаем корабли
const setShips = (socketId, ships) => {
  const idGame = getIdGame(socketId);

  if (idGame !== null) {
    const game = getGame(idGame);

    if (!Array.isArray(game.ships[socketId])) {
      game.ships[socketId] = ships;
      game.maps[socketId] = createArray(0, game.settings.gridSize, game.settings.gridSize);
      console.log('Корабли установлены');

      return true;
    }
  }

  return false;
};

const attackCell = (socketId, pos) => {
  const game = getGame(getIdGame(socketId));
  const enemy = game.users.filter(user => user !== socketId)[0];

  // game.ships[enemy][pos.y][pos.x]
  if (game.maps[enemy][pos.y][pos.x] === 0) {
    let indexShip = null;

    if (
      !game.ships[enemy].some((ship, i) => {
        if (
          ship.cells.some((cell, j) => {
            if (cell.x === pos.x && cell.y === pos.y) {
              game.ships[enemy][i].cells[j].state = false;
              game.maps[enemy][pos.y][pos.x] = 2;

              return true;
            }

            return false;
          })
        ) {
          indexShip = i;

          return true;
        }

        return false;
      })
    ) {
      game.maps[enemy][pos.y][pos.x] = 1;
      game.currUser = enemy;
    }

    if (
      indexShip !== null &&
      game.ships[enemy][indexShip].cells.every(cell => cell.state === false)
    ) {
      const cells = game.ships[enemy][indexShip].cells;
      return {
        start: {
          x: cells[0].x,
          y: cells[0].y,
        },
        end: {
          x: cells[cells.length - 1].x,
          y: cells[cells.length - 1].y,
        },
      };
    }

    return game.maps[enemy][pos.y][pos.x];
  }

  return 0;
};


io.on('connection', (socket) => {
  console.log('a user connected');
  const reloadList = () => {
    io.sockets.emit('list', getListGames());
  };

  socket.on('login', (data, fn) => {
    // Если запрос на добавление пользователя
    if (data !== false) {
      // Если пользователь не зарегистрирован
      if (!isUserLogged(socket.id)) {
        fn(addUser(socket.id, data));
        reloadList();
      } else {
        io.to(socket.id).emit('errorCode', 3);
      }
    } else {
      fn(isUserLogged(socket.id));
    }
  });

  socket.on('newGame', (data, fn) => {
    if (createGame(socket.id, data)) {
      reloadList();
      fn(true);
    }
  });

  socket.on('connectToGame', (gameId, fn) => {
    if (isGameWaiting(gameId) && connectToGame(gameId, socket.id)) {
      const users = getUsersGame(gameId);

      io.to(users[0]).to(users[1]).emit('game', getSettingsGame(gameId));
      reloadList();
      fn(true);
    } else {
      fn(false);
    }
  });

  socket.on('attackCell', (pos, fn) => {
    if (isUserLogged(socket.id)) {
      const gameId = getIdGame(socket.id);

      if (isShipsAdded(gameId) && isCurrentUserGame(gameId, socket.id)) {
        console.log('Ячейка отакована');
        fn(attackCell(socket.id, pos));
      } else {
        console.log('Корабли не добавлены или ход противника');
      }
    } else {
      console.log('Пользователь атакует ячейку, но он не авторизован.');
    }
  });

  socket.on('setShips', (data, fn) => {
    if (setShips(socket.id, data)) {
      fn(true);
    } else {
      fn(false);
    }
  });

  socket.on('disconnecting', () => {
    if (delUser(socket.id)) {
      console.log('Пользователь удален');
    }
    if (delGame(socket.id)) {
      console.log('Игра удалена');
      reloadList();
    }
  });
});

http.listen(8080, () => {
  console.log('Server running on http://localhost:8080...');
});
