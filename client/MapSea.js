import { VERTICAL, HORIZONTAL, settings } from './storage';
import Utils from './Utils';
import Ship from './Ship';

class MapSea {
  constructor(idCanvas = '', gridSize = settings.size.grid, cellSize = settings.size.cell) {
    if (document.getElementById(idCanvas) === null) {
      throw new Error('Element does not exist!');
    }

    if (!Number.isInteger(gridSize) || gridSize < settings.size.grid) {
      throw new Error('Incorrect value of the variable "gridSize"!');
    }

    if (!Number.isInteger(cellSize) || cellSize < settings.size.grid) {
      throw new Error('Incorrect value of the variable "cellSize"!');
    }

    this.$canvas = document.getElementById(idCanvas);
    this.$canvas.setAttribute('width', gridSize * cellSize);
    this.$canvas.setAttribute('height', gridSize * cellSize);
    this._sizeCanvasPx = gridSize * cellSize;
    this._gridSize = gridSize;
    this._cellSize = cellSize;
    this._context = this.$canvas.getContext('2d');
    this._ships = [];
    this._currentShip = null;
  }

  getCanvas() {
    return this.$canvas;
  }

  getContext() {
    return this._context;
  }

  getShips() {
    return this._ships;
  }

  getCurrentShip() {
    return this._currentShip;
  }

  setCurrentShip(x, y, size, orientation, color) {
    if (!(Utils.isCorrectCoordinate(y, this._gridSize) || x === null)) {
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
      const sizeShip = typeof this._currentShip === 'object' ? this._currentShip.size : 0;

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

  addShipToMap() {
    if (typeof this._currentShip !== 'object') {
      return false;
    }

    // The value is true if the distance between ships is greater than 1
    let state = true;

    // The cycle bypassing the array of ships on the map
    for (let a = 0; a < this._ships.length && state; a++) {
      // The cycle bypassing the cells of the current ship
      for (let b = 0; b < this._currentShip.cells.length && state; b++) {
        // The cycle bypassing the ship's cells on the map
        for (let c = 0; c < this._ships[a].cells.length && state; c++) {
          // Distance between coordinates
          const distance =
            Math.floor(Math.sqrt(
              ((this._ships[a].cells[c].x - this._currentShip.cells[b].x) ** 2) +
              ((this._ships[a].cells[c].y - this._currentShip.cells[b].y) ** 2),
            ));

          if (distance <= 1) {
            state = false;
          }
        }
      }
    }

    if (state) {
      this._ships.push(this._currentShip);
      // Delete current ship
      this.setCurrentShip(null);

      return true;
    }

    return false;
  }

  renderGrid() {
    const size = this._context.canvas.width;

    this._context.beginPath();

    for (let pos = this._cellSize; pos <= size; pos += this._cellSize) {
      this._context.moveTo(0.5 + pos, 0);
      this._context.lineTo(0.5 + pos, size);

      this._context.moveTo(0, 0.5 + pos);
      this._context.lineTo(size, 0.5 + pos);
    }

    this._context.strokeStyle = settings.color.grid;
    this._context.stroke();
  }

  renderShips() {
    this._ships.forEach((el) => {
      for (let i = 0; i < el.size; i++) {
        if (!el.cells[i].state) {
          this._context.fillStyle = settings.color.destroyedShip;
        } else {
          this._context.fillStyle = el.color;
        }
        this._context.fillRect(el.cells[i].x * this._cellSize,
          el.cells[i].y * this._cellSize, this._cellSize, this._cellSize);
      }
    });
  }

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

  moveShip(x, y) {
    if (!Utils.isCorrectCoordinate(x, this._gridSize)) {
      throw new Error('Incorrect value of the variable "x"!');
    }

    if (!Utils.isCorrectCoordinate(y, this._gridSize)) {
      throw new Error('Incorrect value of the variable "y"!');
    }

    return this._ships.some((ship, i) => {
      if (ship.cells.some(pos => pos.x === x && pos.y === y)) {
        this._currentShip = this._ships.splice(i, 1)[0];

        return true;
      }

      return false;
    });
  }
}

export default MapSea;
