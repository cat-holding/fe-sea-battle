import { settings } from './../storage';
import Utils from './../Utils';

class Canvas {
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
    this._context = this.$canvas.getContext('2d');
    this._gridSize = gridSize;
    this._cellSize = cellSize;
  }

  /**
   * Clears the canvas
   *
   * @memberOf Canvas
   */
  clearCanvas() {
    this.$canvas.width = this.$canvas.width;
  }

  /**
   * Draws a grid on the canvas
   *
   * @memberOf Canvas
   */
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

  /**
   * Draws ships on canvas
   *
   * @param {Array} ships The array of ships that need to be displayed
   * @param {boolean} [type=false] The display style on the canvas
   *
   * @memberOf Canvas
   */
  renderShips(ships, type = false) {
    if (!Array.isArray(ships)) {
      throw new Error('Incorrect value of the variable "ships"!');
    }
    ships.forEach((ship) => {
      ship.cells.forEach((pos) => {
        const colorShip = pos.state ? ship.color : settings.color.destroyedShip;
        if (type) {
          this.renderInactiveCell(pos.x, pos.y, colorShip);
        } else {
          this.fillCell(pos.x, pos.y, colorShip);
        }
      });
    });
  }

  /**
   * Fills the cell on the canvas in different color
   *
   * @param {Number} x Horizontal coordinate
   * @param {Number} y Vertical coordinate
   * @param {String} color Fill color
   *
   * @memberOf Canvas
   */
  fillCell(x, y, color) {
    if (!Utils.isCorrectCoordinate(x, this._gridSize)) {
      throw new Error('Incorrect value of the variable "x"!');
    }

    if (!Utils.isCorrectCoordinate(y, this._gridSize)) {
      throw new Error('Incorrect value of the variable "y"!');
    }

    if (typeof color !== 'string') {
      throw new Error('Incorrect value of the variable "color"!');
    }

    this._context.fillStyle = color;
    this._context.fillRect(
      x * this._cellSize,
      y * this._cellSize,
      this._cellSize,
      this._cellSize,
    );
  }

  /**
   * Draws an inactive cell on the canvas
   *
   * @param {Number} x Horizontal coordinate
   * @param {Number} y Vertical coordinate
   * @param {String} [color=settings.color.inactiveCell] Fill color
   *
   * @memberOf Canvas
   */
  renderInactiveCell(x, y, color = settings.color.inactiveCell) {
    const _x = x * this._cellSize;
    const _y = y * this._cellSize;
    // Set the canvas area for drawing
    this._context.save();
    this._context.beginPath();
    this._context.rect(_x, _y, this._cellSize, this._cellSize);
    this._context.closePath();
    this._context.clip();
    // Draw diagonal lines
    this._context.beginPath();
    for (let i = _y - this._cellSize;
      i < _y + this._cellSize;
      i += settings.size.lineSpacingInactiveCell) {
      this._context.moveTo(_x, i);
      this._context.lineTo(_x + this._cellSize, i + this._cellSize);
    }
    this._context.lineWidth = 1;
    this._context.strokeStyle = color;
    this._context.closePath();
    this._context.stroke();
    this._context.restore();
  }

  /**
   * Draws a map
   *
   * @memberOf Canvas
   */
  renderCanvas() {
    this.clearCanvas();
    this.renderGrid();
  }
}

export default Canvas;
