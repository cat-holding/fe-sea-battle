// Constants
const VERTICAL = 'VERTICAL';
const HORIZONTAL = 'HORIZONTAL';
// Settings
const settings = {
  color: {
    grid: '#ccc',
    ship: '#2f4f4f',
    destroyedShip: '#ff0000',
    inactiveCell: '#bbb',
  },
  size: {
    // Number of cells by default
    grid: 10,
    // Cell size in pixels by default
    cell: 30,
    // Interval between lines on the background of an inactive cell
    lineSpacingInactiveCell: 5,
  },
  game: {
    mapEditor: true,
    autoSelect: true,
    currShipOrientation: VERTICAL,
    sizeShip: null,
    ships: {
      4: 1,
      3: 2,
      2: 3,
      1: 4,
    },
  },
};

export {
  VERTICAL,
  HORIZONTAL,
  settings,
};
