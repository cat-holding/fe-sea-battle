import Canvas from './Canvas';
import Utils from './Utils';
import { settings } from './storage';

class EnemyMap extends Canvas {
  constructor(...args) {
    super(...args);

    this._enemySea = Utils.createArray(0, this._gridSize, this._gridSize);
  }

  /**
   * Sets the value on the map
   *
   * @param {Number} x Horizontal coordinate
   * @param {Number} y Vertical coordinate
   * @param {Number} value Input value
   *
   * @memberOf EnemyMap
   */
  _setCellMap(x, y, value) {
    if (!Utils.isCorrectCoordinate(x, this._gridSize)) {
      throw new Error('Incorrect value of the variable "x"!');
    }

    if (!Utils.isCorrectCoordinate(y, this._gridSize)) {
      throw new Error('Incorrect value of the variable "y"!');
    }

    if (!(value === 0 || value === 1 || value === 2)) {
      throw new Error('Incorrect value of the variable "value"!');
    }

    this._enemySea[y][x] = value;
  }

  /**
   * Returns the map
   *
   * @returns {Array[Array]} Two-dimensional array
   *
   * @memberOf EnemyMap
   */
  getMap() {
    return this._enemySea;
  }

  /**
   * Makes the cell on the map inactive
   *
   * @param {Number} x Horizontal coordinate
   * @param {Number} y Vertical coordinate
   *
   * @memberOf EnemyMap
   */
  setInactiveCell(x, y) {
    this._setCellMap(x, y, 1);
  }

  /**
   * Makes a cell on the map as a state hit on the ship
   *
   * @param {Number} x Horizontal coordinate
   * @param {Number} y Vertical coordinate
   *
   * @memberOf EnemyMap
   */
  setInactiveCellShip(x, y) {
    this._setCellMap(x, y, 2);
  }

  /**
   * Makes cells around the ship inactive
   *
   * @param {Object} startPos Object with x and y coordinates
   * @param {Object} endPos Object with x and y coordinates
   *
   * @memberOf EnemyMap
   */
  setInactiveSpaceShip(startPos, endPos) {
    const startX = startPos.x - 1 < 0 ? 0 : startPos.x - 1;
    const startY = startPos.y - 1 < 0 ? 0 : startPos.y - 1;
    const endX = endPos.x + 1 > this._gridSize ? this._gridSize : endPos.x + 1;
    const endY = endPos.y + 1 > this._gridSize ? this._gridSize : endPos.y + 1;

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        this._setCellMap(i, j, 1);
      }
    }
  }

  /**
   * Draws a map
   *
   * @memberOf EnemyMap
   */
  renderCanvas() {
    super.renderCanvas();
    this._enemySea.forEach((arr, y) => {
      arr.forEach((value, x) => {
        if (value === 1) {
          this.renderInactiveCell(x, y, settings.color.inactiveCell);
        } else if (value === 2) {
          this.renderInactiveCell(x, y, settings.color.destroyedShip);
        }
      });
    });
  }
}

export default EnemyMap;
