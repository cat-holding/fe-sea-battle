const Utils = require('./utils.service');
const auth = require('./auth.service');
// const isUserPlaying = require('./selectGame.service').isUserPlaying;

/**
 * Check whether the user is playing
 *
 * @param {String} idSocket The user's socket
 * @param {Array} arrGames The array of games
 * @returns {Boolean}
 */
const isUserPlaying = (idSocket, arrGames) =>
  arrGames.some(game => game.users.indexOf(idSocket) !== -1);

/**
 * Get the object of the game by the game ID
 *
 * @param {String} idGame Game identifier
 * @param {Array} arrGames The array of games
 * @returns {Object|Null}
 */
const getGame = (idGame, arrGames) => {
  if (!Array.isArray(arrGames)) {
    throw new Error('The variable "arrGames" is not an array');
  }

  let obj = null;

  arrGames.some((game) => {
    if (game.idGame === idGame) {
      obj = game;

      return true;
    }

    return false;
  });

  return obj;
};

const createGame = (idSocket, settings, arrGames, arrUsers) =>
  new Promise((resolve, reject) => {
    if (!Array.isArray(arrGames)) {
      throw new Error('The "arrGames" is not an Array!');
    }

    if (!Array.isArray(arrUsers)) {
      throw new Error('The "arrUsers" is not an Array!');
    }

    if (auth.isUserAuthorized(idSocket, arrUsers)) {
      if (!isUserPlaying(idSocket, arrGames)) {
        if (Utils.isValidSettinsGame(settings)) {
          arrGames.push({
            idGame: idSocket,
            currUser: idSocket,
            users: [idSocket],
            settings: {
              gridSize: settings.gridSize,
              ships: settings.ships,
            },
            maps: {
              // idSocket: null,
            },
            ships: {
              // idSocket: null,
            },
          });

          resolve(true);
        } else {
          reject(new Error('Incorrect game settings'));
        }
      } else {
        reject(new Error('The user already plays the game'));
      }
    } else {
      reject(new Error('User is not authorized'));
    }
  });

const getIdGame = (idSocket, arrGames) => {
  if (!Array.isArray(arrGames)) {
    throw new Error('The "arrGames" is not an Array!');
  }

  let idGame = null;

  arrGames.some((game) => {
    if (game.users.indexOf(idSocket) !== -1) {
      idGame = game.idGame;

      return true;
    }

    return false;
  });

  return idGame;
};

const setShips = (idSocket, ships, arrGames) => {
  const idGame = getIdGame(idSocket, arrGames);

  if (idGame !== null) {
    const game = getGame(idGame, arrGames);

    if (!Array.isArray(game.ships[idSocket])) {
      game.ships[idSocket] = ships;
      game.maps[idSocket] = Utils.createArray(0, game.settings.gridSize, game.settings.gridSize);

      return true;
    }
  }

  return false;
};

const getEnemy = (idSocket, arrUsers) => {
  if (!Array.isArray(arrUsers)) {
    throw new Error('The "arrUsers" is not an Array!');
  }

  const enemy = arrUsers.filter(user => user !== idSocket)[0];

  return !Utils.isEmptyString(enemy) ? enemy : null;
};

const isAllShipsAdded = (game) => {
  if (typeof game.ships === 'object') {
    const keys = Object.keys(game.ships);

    return keys.length === 2 && keys.every(idSocket => Array.isArray(game.ships[idSocket]) &&
      game.ships[idSocket].length > 0);
  }

  return false;
};

const getStateShips = (idSocket, game) => {
  if (Utils.isEmptyString(idSocket)) {
    throw new Error('The invalid idSocket');
  }

  return Array.isArray(game.ships[idSocket]) ?
    game.ships[idSocket].map(ship =>
      ({
        cells: ship.cells.map(cell => ({ state: cell.state })),
      })) : [];
};

const setInactiveSpaceShip = (startPos, endPos, map) => {
  const _map = map;

  if (!Array.isArray(_map)) {
    throw new Error('The "map" is not an Array!');
  }

  const gridSize = _map.length;

  if (!(Utils.isNaturalNumberOrZero(gridSize) && gridSize > 0)) {
    throw new Error('An incorrect "gridSize" variable!');
  }

  if (
    !(Utils.isCorrectCoordinate(startPos.x, gridSize) &&
      Utils.isCorrectCoordinate(startPos.y, gridSize) &&
      Utils.isCorrectCoordinate(endPos.x, gridSize) &&
      Utils.isCorrectCoordinate(endPos.y, gridSize))
  ) {
    throw new Error('The coordinates are incorrect!');
  }

  const startX = startPos.x - 1 < 0 ? 0 : startPos.x - 1;
  const startY = startPos.y - 1 < 0 ? 0 : startPos.y - 1;
  const endX = endPos.x + 1 >= gridSize ? gridSize - 1 : endPos.x + 1;
  const endY = endPos.y + 1 >= gridSize ? gridSize - 1 : endPos.y + 1;

  for (let i = startX; i <= endX; i++) {
    for (let j = startY; j <= endY; j++) {
      if (_map[j][i] === 0) {
        _map[j][i] = 1;
      }
    }
  }
};

const isShipDestroyed = ship => ship.cells.every(cell => cell.state === false);

const isAllShipsDestroyed = arrShips => arrShips.every(ship => isShipDestroyed(ship));

const getResultsGame = (game) => {
  const idsSockets = Object.keys(game.ships);
  const result = {};

  if (idsSockets.length !== 2) {
    throw new Error('Error. Ships should be for two players');
  }

  idsSockets.forEach((idSocket, i) => {
    const enemySocket = idsSockets[i === 0 ? 1 : 0];

    result[enemySocket] = 0;
    game.ships[idSocket].forEach(ship =>
      ship.cells.forEach((cell) => {
        if (cell.state === false) {
          result[enemySocket] += 1;
        }
      }));
  });

  return result;
};

const attackCell = (idSocket, pos, arrGames, arrUsers) =>
  new Promise((resolve, reject) => {
    if (auth.isUserAuthorized(idSocket, arrUsers)) {
      const game = getGame(getIdGame(idSocket, arrGames), arrGames);
      const enemy = getEnemy(idSocket, game.users);

      if (game.currUser === idSocket) {
        if (enemy !== null) {
          if (isAllShipsAdded(game)) {
            if (Utils.isCorrectCoordinate(pos.x, game.settings.gridSize) &&
              Utils.isCorrectCoordinate(pos.y, game.settings.gridSize)) {
              if (game.maps[enemy][pos.y][pos.x] === 0) {
                let indexShip = null;
                let stateShips;

                if (
                  !game.ships[enemy].some((ship, i) => {
                    if (
                      ship.cells.some((cell, j) => {
                        if (cell.x === pos.x && cell.y === pos.y) {
                          game.ships[enemy][i].cells[j].state = false;
                          game.maps[enemy][pos.y][pos.x] = 2;
                          stateShips = getStateShips(enemy, game);

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
                  isShipDestroyed(game.ships[enemy][indexShip])
                ) {
                  const cells = game.ships[enemy][indexShip].cells;
                  const start = {
                    x: cells[0].x,
                    y: cells[0].y,
                  };
                  const end = {
                    x: cells[cells.length - 1].x,
                    y: cells[cells.length - 1].y,
                  };

                  setInactiveSpaceShip(start, end, game.maps[enemy]);
                  resolve({
                    result: {
                      start,
                      end,
                    },
                    enemy,
                    stateShips,
                    allShipsDestroyed: isAllShipsDestroyed(game.ships[enemy]),
                  });
                } else {
                  resolve({
                    result: game.maps[enemy][pos.y][pos.x],
                    enemy,
                    stateShips,
                    allShipsDestroyed: false,
                  });
                }
              } else {
                reject(new Error('Coordinate is locked'));
              }
            } else {
              reject(new Error('Incorrect coordinate'));
            }
          } else {
            reject(new Error('Ships not added'));
          }
        } else {
          reject(new Error('The enemy was not found'));
        }
      } else {
        reject(new Error('The course of the enemy'));
      }
    } else {
      reject(new Error('User is not authorized'));
    }
  });

module.exports = {
  isUserPlaying,
  getGame,
  createGame,
  getIdGame,
  setShips,
  attackCell,
  getResultsGame,
};
