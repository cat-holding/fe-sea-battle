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
}

export default Utils;
