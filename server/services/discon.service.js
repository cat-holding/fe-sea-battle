const Utils = require('./utils.service');

/**
 * Delete the user using idSocket
 *
 * @param {String} idSocket The user's socket
 * @param {Array} arrUsers Array of users
 * @returns {Boolean}
 */
const delUser = (idSocket, arrUsers) => {
  if (!Array.isArray(arrUsers)) {
    throw new Error('The variable "arrUsers" is not an array');
  }

  if (!Utils.isEmptyString(idSocket)) {
    return arrUsers.some((el, i, users) => {
      if (el.id === idSocket) {
        users.splice(i, 1);

        return true;
      }

      return false;
    });
  }

  return false;
};

const delGame = (idSocket, arrGames) => {
  if (!Array.isArray(arrGames)) {
    throw new Error('The "arrGames" is not an Array!');
  }

  let users = [];

  const result = arrGames.some((game, i) => {
    if (game.users.indexOf(idSocket) !== -1) {
      users = game.users;
      arrGames.splice(i, 1);

      return true;
    }

    return false;
  });

  users = users.filter(el => el !== idSocket)[0];

  return Utils.isString(users) ? users : result;
};

module.exports = {
  delUser,
  delGame,
};
