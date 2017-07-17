/**
 * Check for matching to String type
 *
 * @param {any} str Input value
 */
const isString = str => typeof str === 'string';


/**
 * Check if the string is empty
 *
 * @param {String} str Input value
 */
const isEmptyString = str => !(isString(str) && str.length !== 0);

/**
 * Validate the correct user's nickname
 *
 * @param {String} nickname Input value
 */
const isValidNickname = nickname => isString(nickname) && /^[0-9a-zA-Zа-яА-Я ]{3,20}$/.test(nickname);

const isValidSettinsGame = settings =>
  settings.gridSize >= 10 && settings.gridSize <= 20 && settings.gridSize % 1 === 0 &&
  Object.keys(settings.ships).every(i =>
    settings.ships[i] > 0 && settings.ships[i] <= 10 && settings.ships[i] % 1 === 0);

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

const isCorrectCoordinate = (value, gridSize) => value >= 0 && value % 1 === 0 && value < gridSize;

module.exports = {
  isString,
  isEmptyString,
  isValidNickname,
  isValidSettinsGame,
  isNaturalNumberOrZero,
  createArray,
  isCorrectCoordinate,
};
