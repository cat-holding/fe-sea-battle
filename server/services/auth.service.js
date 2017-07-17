const Utils = require('./utils.service');

/**
 * Check whether the user is authorized
 *
 * @param {String} idSocket The user's socket
 * @param {Array} arrUsers Array of users
 * @returns {Boolean}
 */
const isUserAuthorized = (idSocket, arrUsers) => {
  if (!Array.isArray(arrUsers)) {
    throw new Error('The variable "arrUsers" is not an array');
  }

  return arrUsers.some(user => user.id === idSocket);
};

/**
 * Get the nickname of the user by idSocket
 *
 * @param {String} idSocket The user's socket
 * @param {Array} arrUsers Array of users
 * @returns {Null|String}
 */
const getNickname = (idSocket, arrUsers) => {
  if (!Array.isArray(arrUsers)) {
    throw new Error('The variable "arrUsers" is not an array');
  }

  let nickname = null;

  if (!Utils.isEmptyString(idSocket)) {
    arrUsers.some((user) => {
      if (user.id === idSocket) {
        nickname = user.nickname;

        return true;
      }

      return false;
    });
  }

  return nickname;
};

/**
 * Add the user to the authorized list
 *
 * @param {String} idSocket The user's socket
 * @param {String} nickname The user's nickname
 * @param {Array} arrUsers Array of users
 * @returns {Promise}
 */
const addUser = (idSocket, nickname, arrUsers) =>
  new Promise((resolve, reject) => {
    if (!Array.isArray(arrUsers)) {
      reject(new Error('The variable "arrUsers" is not an array'));
    }

    if (!isUserAuthorized(idSocket, arrUsers)) {
      if (Utils.isValidNickname(nickname)) {
        arrUsers.push({
          id: idSocket,
          nickname,
        });
        resolve(true);
      } else {
        reject(new Error('The invalid user\'s nickname'));
      }
    } else {
      reject(new Error('The user is authorized'));
    }
  });

module.exports = {
  isUserAuthorized,
  getNickname,
  addUser,
};
