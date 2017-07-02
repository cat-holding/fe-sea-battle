class Utils {
  /**
   * Checks whether the number is a natural number or zero.
   *
   * @static
   * @param {Number} number Input number
   * @returns {Boolean}
   *
   * @memberOf Utils
   */
  static isNaturalNumberOrZero(number) {
    return Number.isInteger(number) && number >= 0;
  }

  /**
   * Checks the finding of a number in the grid
   *
   * @static
   * @param {Number} value Input number (natural or zero)
   * @param {Number} gridSize The size of the grid
   * @returns {Boolean}
   *
   * @memberOf Utils
   */
  static isCorrectCoordinate(value, gridSize) {
    if (this.isNaturalNumberOrZero(value) && value < gridSize) {
      return true;
    }

    return false;
  }

  /**
   * Creates and initializes an array of a specified length
   *
   * @static
   * @param {Any} [value=null] The value to initialize the array
   * @param {Number} [columns=1] Number of columns
   * @param {Number} [lines=0] Number of lines
   * @returns {Array|Array[Array]} One-dimensional or two-dimensional array
   *
   * @memberOf Utils
   */
  static createArray(value = null, columns = 1, lines = 0) {
    if (!this.isNaturalNumberOrZero(columns) || columns === 0) {
      throw new Error('Incorrect value of the variable "columns"!');
    }

    if (!this.isNaturalNumberOrZero(lines)) {
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
  }
}

export default Utils;
