const Game = require('./game.service');
const Auth = require('./auth.service');

/**
 * Check if the game is in the waiting state
 *
 * @param {String} idGame Game identifier
 * @param {Array} arrGames The array of games
 * @returns {Boolean}
 */
const isGameWaiting = (idGame, arrGames) => {
  const game = Game.getGame(idGame, arrGames);

  return game !== null && Array.isArray(game.users) && game.users.length !== 2;
};


/**
 * Get a list of available games
 *
 * @param {Array} arrGames The array of games
 * @param {Array} arrUsers The array of users
 * @returns {Array}
 */
const getListGames = (arrGames, arrUsers) => {
  if (!Array.isArray(arrGames)) {
    throw new Error('The variable "arrGames" is not an array');
  }

  if (!Array.isArray(arrUsers)) {
    throw new Error('The variable "arrUsers" is not an array');
  }

  const list = [];

  arrGames.forEach((game) => {
    if (isGameWaiting(game.idGame, arrGames)) {
      list.push({
        idGame: game.idGame,
        nickname: Auth.getNickname(game.idGame, arrUsers),
        gridSize: game.settings.gridSize,
        ships: game.settings.ships,
      });
    }
  });

  return list;
};

/**
 * Get the game settings
 *
 * @param {String} idGame Game identifier
 * @param {Array} arrGames The array of games
 * @returns {Object|Null}
 */
const getSettingsGame = (idGame, arrGames) => {
  const game = Game.getGame(idGame, arrGames);

  return game !== null ? game.settings : null;
};

/**
 * Get the users of the game
 *
 * @param {String} idGame Game identifier
 * @param {Array} arrGames The array of games
 * @returns {Array|Null}
 */
const getUsersGame = (idGame, arrGames) => {
  const game = Game.getGame(idGame, arrGames);

  return game !== null ? game.users : null;
};

/**
 * Connect the user to the game
 *
 * @param {String} idGame Game identifier
 * @param {String} idSocket The user's socket
 * @param {Array} arrUsers The array of users
 * @param {Array} arrGames The array of games
 * @returns {Promise}
 */
const connectToGame = (idGame, idSocket, arrUsers, arrGames) =>
  new Promise((resolve, reject) => {
    if (Auth.isUserAuthorized(idSocket, arrUsers)) {
      if (!Game.isUserPlaying(idSocket, arrGames)) {
        if (isGameWaiting(idGame, arrGames)) {
          const game = Game.getGame(idGame, arrGames);

          game.users.push(idSocket);
          game.ships[idSocket] = null;
          game.maps[idSocket] = null;
          resolve(true);
        } else {
          reject(new Error('This game is locked'));
        }
      } else {
        reject(new Error('The user participates in another game'));
      }
    } else {
      reject(new Error('User is not authorized'));
    }
  });

module.exports = {
  isGameWaiting,
  getListGames,
  getSettingsGame,
  getUsersGame,
  connectToGame,
};
