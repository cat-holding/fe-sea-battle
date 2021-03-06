import Canvas from './Canvas';
import Utils from './../Utils';
import Ship from './Ship';
import { VERTICAL, HORIZONTAL } from './../storage';

class MyMap extends Canvas {
  constructor(...args) {
    super(...args);

    this._currentShip = null;
    this._ships = [];
  }

  /**
   * Checks the distance between the ships
   *
   * @param {Ship} shipA One of the verified ships
   * @param {Ship} shipB One of the verified ships
   * @returns {Boolean}
   *
   * @memberOf Utils
   */
  static isAllowableDistance(shipA, shipB) {
    // The value is true if the distance between ships is greater than 1
    let state = true;

    // The cycle bypassing the cells of the shipA
    for (let a = 0; a < shipA.cells.length && state; a++) {
      // The cycle bypassing the cells of the shipB
      for (let b = 0; b < shipB.cells.length && state; b++) {
        // Distance between coordinates
        const distance =
          Math.floor(Math.sqrt(
            ((shipB.cells[b].x - shipA.cells[a].x) ** 2) +
            ((shipB.cells[b].y - shipA.cells[a].y) ** 2),
          ));

        if (distance <= 1) {
          state = false;
        }
      }
    }

    return state;
  }

  /**
   * Places the ship in the preview area
   *
   * @param {Number|Null} x Horizontal coordinate
   * @param {Number} y Vertical coordinate
   * @param {Number} size The size of the ship
   * @param {String} orientation It can take the values of "VERTICAL" and "HORIZONTAL".
   * @param {String} color The color of the ship
   * @returns {Number|Boolean} Returns the size of the ship upon removal,
   * the "TRUE" if the ship was added and a "FALSE" in case of an error.
   *
   * @memberOf MyMap
   */
  setCurrentShip(x, y, size, orientation, color) {
    if (!(Utils.isCorrectCoordinate(x, this._gridSize) || x === null)) {
      throw new Error('Incorrect value of the variable "x"!');
    }

    if (x !== null) {
      if (!Utils.isCorrectCoordinate(y, this._gridSize)) {
        throw new Error('Incorrect value of the variable "y"!');
      }

      if (!(Utils.isNaturalNumberOrZero(size) && size > 0)) {
        throw new Error('Incorrect value of the variable "size"!');
      }

      if (!(orientation === VERTICAL || orientation === HORIZONTAL)) {
        throw new Error('Incorrect value of the variable "orientation"!');
      }
    }

    // If the variable is "null" then delete the currentShip otherwise set currentShip
    if (x === null) {
      const sizeShip = Utils.isObject(this._currentShip) ? this._currentShip.size : 0;

      this._currentShip = null;

      return sizeShip;
    } else if (x !== null) {
      const orient = orientation === VERTICAL;
      let changeableStartPos = orient ? y : x;
      const constPos = orient ? x : y;
      const endPos = changeableStartPos + (size - 1);

      // The end position is beyond the boundaries of the map.
      if (endPos > this._gridSize - 1) {
        changeableStartPos += this._gridSize - 1 - endPos;
      }

      this._currentShip =
        Ship(
          {
            x: orient ? constPos : changeableStartPos,
            y: orient ? changeableStartPos : constPos,
          },
          {
            x: orient ? constPos : changeableStartPos + (size - 1),
            y: orient ? changeableStartPos + (size - 1) : constPos,
          },
          color,
        );

      return true;
    }

    return false;
  }

  /**
   * Places the ship on the map from the preview area
   *
   * @returns {Boolean} The "TRUE" is if the ship was added
   *
   * @memberOf MyMap
   */
  addShipToMap() {
    if (
      typeof this._currentShip === 'object' &&
      !this._ships.some(ship => !MyMap.isAllowableDistance(ship, this._currentShip))
    ) {
      this._ships.push(this._currentShip);
      // Delete current ship
      this.setCurrentShip(null);

      return true;
    }

    return false;
  }

  /**
   * Marks the ship's cell as destroyed
   *
   * @param {Number} x Horizontal coordinate
   * @param {Number} y Vertical coordinate
   * @returns {Boolean} If the cell has been marked, it returns true
   *
   * @memberOf MyMap
   */
  attackCell(x, y) {
    if (!Utils.isCorrectCoordinate(x, this._gridSize)) {
      throw new Error('Incorrect value of the variable "x"!');
    }

    if (!Utils.isCorrectCoordinate(y, this._gridSize)) {
      throw new Error('Incorrect value of the variable "y"!');
    }

    return this._ships.some(
      ship => ship.cells.some(
        (pos) => {
          const egitPos = pos;

          if (egitPos.x === x && egitPos.y === y) {
            egitPos.state = false;

            return true;
          }

          return false;
        }),
    );
  }

  /**
   * Draws a map
   *
   * @memberOf MyMap
   */
  renderCanvas() {
    super.renderCanvas();

    this.renderShips(this._ships);

    if (
      this._currentShip !== null &&
      this._ships.some(ship => !MyMap.isAllowableDistance(ship, this._currentShip))
    ) {
      this.renderShips([this._currentShip], true);
    } else if (this._currentShip !== null) {
      this.renderShips([this._currentShip]);
    }
  }
}

export default MyMap;
