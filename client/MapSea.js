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

    const $canvas = document.getElementById(idCanvas);
    const context = $canvas.getContext('2d');
    const ships = [];
    let currentShip = null;
    this._sizeCanvasPx = gridSize * cellSize;

    $canvas.setAttribute('width', gridSize * cellSize);
    $canvas.setAttribute('height', gridSize * cellSize);

    this.getCanvas = () => $canvas;

    this.getContext = () => context;

    this.getShips = () => ships;

    this.getCurrentShip = () => currentShip;

    this.setCurrentShip = (x, y, size, orientation, color) => {
      if (!(Utils.isCorrectCoordinate(y, gridSize) || x === null)) {
        throw new Error('Incorrect value of the variable "x"!');
      }

      if (x !== null) {
        if (!Utils.isCorrectCoordinate(y, gridSize)) {
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
        const sizeShip = typeof currentShip === 'object' ? currentShip.size : 0;

        currentShip = null;

        return sizeShip;
      } else if (x !== null) {
        const orient = orientation === 'VERTICAL';
        let changeableStartPos = orient ? y : x;
        const constPos = orient ? x : y;
        const endPos = changeableStartPos + (size - 1);

        // The end position is beyond the boundaries of the map.
        if (endPos > gridSize - 1) {
          changeableStartPos += gridSize - 1 - endPos;
        }

        currentShip =
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
    };

    this.addShipToMap = () => {
      if (typeof currentShip !== 'object') {
        return false;
      }

      // The value is true if the distance between ships is greater than 1
      let state = true;

      // The cycle bypassing the array of ships on the map
      for (let a = 0; a < ships.length && state; a++) {
        // The cycle bypassing the cells of the current ship
        for (let b = 0; b < currentShip.cells.length && state; b++) {
          // The cycle bypassing the ship's cells on the map
          for (let c = 0; c < ships[a].cells.length && state; c++) {
            // Distance between coordinates
            const distance =
              Math.floor(Math.sqrt(
                ((ships[a].cells[c].x - currentShip.cells[b].x) ** 2) +
                ((ships[a].cells[c].y - currentShip.cells[b].y) ** 2),
              ));

            if (distance <= 1) {
              state = false;
            }
          }
        }
      }

      if (state) {
        ships.push(currentShip);
        // Delete current ship
        this.setCurrentShip(null);

        return true;
      }

      return false;
    };

    this.renderGrid = () => {
      const size = context.canvas.width;

      context.beginPath();

      for (let pos = cellSize; pos <= size; pos += cellSize) {
        context.moveTo(0.5 + pos, 0);
        context.lineTo(0.5 + pos, size);

        context.moveTo(0, 0.5 + pos);
        context.lineTo(size, 0.5 + pos);
      }

      context.strokeStyle = '#ccc';
      context.stroke();
    };

    this.renderShips = () => {
      ships.forEach((el) => {
        for (let i = 0; i < el.size; i++) {
          if (!el.cells[i].state) {
            context.fillStyle = '#ff0000';
          } else {
            context.fillStyle = el.color;
          }
          context.fillRect(el.cells[i].x * cellSize, el.cells[i].y * cellSize, cellSize, cellSize);
        }
      });
    };

    this.attackCell = (x, y) => {
      if (!Utils.isCorrectCoordinate(x, gridSize)) {
        throw new Error('Incorrect value of the variable "x"!');
      }

      if (!Utils.isCorrectCoordinate(y, gridSize)) {
        throw new Error('Incorrect value of the variable "y"!');
      }

      return ships.some(
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
    };

    this.moveShip = (x, y) => {
      if (!Utils.isCorrectCoordinate(x, gridSize)) {
        throw new Error('Incorrect value of the variable "x"!');
      }

      if (!Utils.isCorrectCoordinate(y, gridSize)) {
        throw new Error('Incorrect value of the variable "y"!');
      }

      return ships.some((ship, i) => {
        if (ship.cells.some(pos => pos.x === x && pos.y === y)) {
          currentShip = ships.splice(i, 1)[0];

          return true;
        }

        return false;
      });
    };
  }
}

export default MapSea;
