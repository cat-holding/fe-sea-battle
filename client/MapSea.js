import Utils from './Utils';
import Ship from './Ship';

class MapSea {
  constructor(idCanvas = '', gridSize = 10, cellSize = 40) {
    if (document.getElementById(idCanvas) === null) {
      throw new Error('Element does not exist!');
    }

    if (!Number.isInteger(gridSize) || gridSize < 10) {
      throw new Error('Incorrect value of the variable "gridSize"!');
    }

    if (!Number.isInteger(cellSize) || cellSize < 10) {
      throw new Error('Incorrect value of the variable "cellSize"!');
    }

    this.$canvas = document.getElementById(idCanvas);
    this.$canvas.setAttribute('width', gridSize * cellSize);
    this.$canvas.setAttribute('height', gridSize * cellSize);
    this._sizeCanvasPx = gridSize * cellSize;
    this.gridSize = gridSize;
    this.cellSize = cellSize;
    this.context = this.$canvas.getContext('2d');
    this.ships = [];
    this.currentShip = null;
  }

  getCanvas() {
    return this.$canvas;
  }

  getContext() {
    return this.context;
  }

  getShips() {
    return this.ships;
  }

  getCurrentShip() {
    return this.currentShip;
  }

  setCurrentShip(x, y, size, orientation, color) {
    if (!(Utils.isCorrectCoordinate(y, this.gridSize) || x === null)) {
      throw new Error('Incorrect value of the variable "x"!');
    }

    if (x !== null) {
      if (!Utils.isCorrectCoordinate(y, this.gridSize)) {
        throw new Error('Incorrect value of the variable "y"!');
      }

      if (!(Utils.isNaturalNumberOrZero(size) && size > 0)) {
        throw new Error('Incorrect value of the variable "size"!');
      }

      if (!(orientation === 'VERTICAL' || orientation === 'HORIZONTAL')) {
        throw new Error('Incorrect value of the variable "orientation"!');
      }
    }

    // If the variable is "null" then delete the currentShip otherwise set currentShip
    if (x === null) {
      const sizeShip = typeof this.currentShip === 'object' ? this.currentShip.size : 0;

      this.currentShip = null;

      return sizeShip;
    } else if (x !== null) {
      const orient = orientation === 'VERTICAL';
      let changeableStartPos = orient ? y : x;
      const constPos = orient ? x : y;
      const endPos = changeableStartPos + (size - 1);

      // The end position is beyond the boundaries of the map.
      if (endPos > this.gridSize - 1) {
        changeableStartPos += this.gridSize - 1 - endPos;
      }

      this.currentShip =
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
    if (typeof this.currentShip !== 'object') {
      return false;
    }

    // The value is true if the distance between ships is greater than 1
    let state = true;

    // The cycle bypassing the array of ships on the map
    for (let a = 0; a < this.ships.length && state; a++) {
      // The cycle bypassing the cells of the current ship
      for (let b = 0; b < this.currentShip.cells.length && state; b++) {
        // The cycle bypassing the ship's cells on the map
        for (let c = 0; c < this.ships[a].cells.length && state; c++) {
          // Distance between coordinates
          const distance =
            Math.floor(Math.sqrt(
              ((this.ships[a].cells[c].x - this.currentShip.cells[b].x) ** 2) +
              ((this.ships[a].cells[c].y - this.currentShip.cells[b].y) ** 2),
            ));

          if (distance <= 1) {
            state = false;
          }
        }
      }
    }

    if (state) {
      this.ships.push(this.currentShip);
      // Delete current ship
      this.setCurrentShip(null);

      return true;
    }

    return false;
  }

  renderGrid() {
    const size = this.context.canvas.width;

    this.context.beginPath();

    for (let pos = this.cellSize; pos <= size; pos += this.cellSize) {
      this.context.moveTo(0.5 + pos, 0);
      this.context.lineTo(0.5 + pos, size);

      this.context.moveTo(0, 0.5 + pos);
      this.context.lineTo(size, 0.5 + pos);
    }

    this.context.strokeStyle = '#ccc';
    this.context.stroke();
  }

  renderShips() {
    this.ships.forEach((el) => {
      for (let i = 0; i < el.size; i++) {
        if (!el.cells[i].state) {
          this.context.fillStyle = '#ff0000';
        } else {
          this.context.fillStyle = el.color;
        }
        this.context.fillRect(el.cells[i].x * this.cellSize,
          el.cells[i].y * this.cellSize, this.cellSize, this.cellSize);
      }
    });
  }

  attackCell(x, y) {
    if (!Utils.isCorrectCoordinate(x, this.gridSize)) {
      throw new Error('Incorrect value of the variable "x"!');
    }

    if (!Utils.isCorrectCoordinate(y, this.gridSize)) {
      throw new Error('Incorrect value of the variable "y"!');
    }

    return this.ships.some(
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
    if (!Utils.isCorrectCoordinate(x, this.gridSize)) {
      throw new Error('Incorrect value of the variable "x"!');
    }

    if (!Utils.isCorrectCoordinate(y, this.gridSize)) {
      throw new Error('Incorrect value of the variable "y"!');
    }

    return this.ships.some((ship, i) => {
      if (ship.cells.some(pos => pos.x === x && pos.y === y)) {
        this.currentShip = this.ships.splice(i, 1)[0];

        return true;
      }

      return false;
    });
  }
}

export default MapSea;
