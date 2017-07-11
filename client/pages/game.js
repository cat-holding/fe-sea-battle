import EnemyMap from './../game/EnemyMap';
import MyMap from './../game/MyMap';
import Utils from './../Utils';
import { VERTICAL, HORIZONTAL, settings } from './../storage';

export const renderMyShipsHTML = (arr) => {
  const $divShips = document.querySelector('#root div.ships');

  if ($divShips !== null) {
    let html = '';

    arr.forEach((ship) => {
      html += '<div class="ship">';
      ship.cells.forEach((cell) => {
        html += `<div${cell.state ? '' : ' class="ship"'}></div>`;
      });
      html += '</div>';
    });

    $divShips.innerHTML = html;
  }
};

export const renderGameHTML = (socket) => {
  const $root = document.getElementById('root');

  $root.innerHTML =
    `<ul class="list">
      <li class="list_el panel-ships">
        <span class="title">The condition of your ships:</span>
        <div class="ships" style="display: flex;"></div>
      </li>
    </ul>
    <ul class="list">
      <li class="list_el">
        <canvas id="sea"></canvas>
      </li>
    </ul>`;

  const $canvas = document.getElementById('sea');

  const enemyMap = new EnemyMap('sea');
  const myMap = new MyMap('sea');

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
        const keysShips = Object.keys(settings.game.ships);

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

  const isAllShipsAdded = () =>
    Object.keys(settings.game.ships)
      .every(sizeShip => settings.game.ships[sizeShip] === 0);

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

              if (isAllShipsAdded()) {
                settings.game.mapEditor = false;
                // TODO: удалить _ships
                socket.emit('setShips', myMap._ships, (status) => {
                  if (status) {
                    renderMyShipsHTML(myMap._ships);
                  }
                });

                render();
              }
            }
          }
        } else {
          throw new Error('Incorrect value of the variable "settings.game.sizeShip"!');
        }
      } else {
        socket.emit('attackCell', { x: pos.x, y: pos.y }, (status) => {
          if (status === 1) {
            enemyMap.setInactiveCell(pos.x, pos.y);
          } else if (status === 2) {
            enemyMap.setInactiveCellShip(pos.x, pos.y);
          } else if (typeof status === 'object') {
            enemyMap.setInactiveCellShip(pos.x, pos.y);
            enemyMap.setInactiveSpaceShip(status.start, status.end);
          } else if (status === 0) {
            console.log('Ячейка уже использована');
          } else {
            console.log('');
          }

          render();
        });
      }
    }
  };

  // const $canvas = document.getElementById('sea');

  $canvas.addEventListener('mousemove', paint);
  $canvas.addEventListener('click', canvasClick);
  render();
};
