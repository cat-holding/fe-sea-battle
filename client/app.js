import io from 'socket.io-client';
import EnemyMap from './game/EnemyMap';
import MyMap from './game/MyMap';
import Utils from './Utils';
import { VERTICAL, HORIZONTAL, settings } from './storage';

const enemyMap = new EnemyMap('sea');
const myMap = new MyMap('sea');
const keysShips = Object.keys(settings.game.ships);

const render = () => {
  if (settings.game.mapEditor) {
    myMap.renderCanvas();
  } else {
    enemyMap.renderCanvas();
  }
};

const getPosition = (e) => {
  const _x = Math.floor((e.pageX - e.currentTarget.offsetLeft) / settings.size.cell);
  const _y = Math.floor((e.pageY - e.currentTarget.offsetTop) / settings.size.cell);

  return Utils.isCorrectCoordinates(_x, _y, settings.size.grid) ? { x: _x, y: _y } : false;
};

const paint = (e) => {
  const pos = getPosition(e);
  // debugger;
  if (pos !== false && settings.game.mapEditor === true) {
    if (
      !(Utils.isNaturalNumberOrZero(settings.game.sizeShip) ||
        Utils.isNull(settings.game.sizeShip))
    ) {
      throw new Error('Incorrect value of the variable "settings.game.sizeShip"!');
    }

    if (
      settings.game.autoSelect &&
      settings.game.ships[settings.game.sizeShip] !== 0
    ) {
      for (let i = keysShips.length - 1; i >= 0; i--) {
        if (settings.game.ships[keysShips[i]] > 0) {
          settings.game.sizeShip = +keysShips[i];
          break;
        }
      }
    }

    if (settings.game.sizeShip !== null && settings.game.ships[settings.game.sizeShip] !== 0) {
      myMap.setCurrentShip(
        pos.x,
        pos.y,
        settings.game.sizeShip,
        settings.game.currShipOrientation,
      );
    }
  }

  render();
};

const canvasClick = (e) => {
  const pos = getPosition(e);

  if (pos !== false) {
    if (settings.game.mapEditor === true) {
      if (
        Utils.isNaturalNumberOrZero(settings.game.sizeShip) &&
        !Utils.isNull(settings.game.sizeShip) &&
        settings.game.ships[settings.game.sizeShip] !== 0
      ) {
        if (myMap.addShipToMap()) {
          settings.game.ships[settings.game.sizeShip] -= 1;
          if (settings.game.ships[settings.game.sizeShip] === 0) {
            settings.game.sizeShip = null;
          }
        }
      } else {
        throw new Error('Incorrect value of the variable "settings.game.sizeShip"!');
      }
    } else {
      if (true) {
        enemyMap.setInactiveCell(pos.x, pos.y);
      } else if (false) {
        enemyMap.setInactiveCellShip(pos.x, pos.y);
      } else if (false) {
        enemyMap.setInactiveSpaceShip();
      }

      render();
    }
  }
};

const $canvas = document.getElementById('sea');

$canvas.addEventListener('mousemove', paint);
$canvas.addEventListener('click', canvasClick);
document.addEventListener('keydown', (e) => {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 82:
      settings.game.currShipOrientation = settings.game.currShipOrientation === VERTICAL ?
        HORIZONTAL : VERTICAL;
      break;
    case 69:
      settings.game.mapEditor = !settings.game.mapEditor;
      render();
      break;

    default:
      break;
  }
});

const socket = io('http://localhost:8080');
socket.on('status', status => console.log(status));
socket.emit('setStore', 777);
