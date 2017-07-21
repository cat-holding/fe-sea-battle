import io from 'socket.io-client';

import { renderLoginHTML } from './pages/login';
import { renderListHTML, refreshList } from './pages/list';
import { renderGameHTML, renderMyShipsHTML } from './pages/game';

import { VERTICAL, HORIZONTAL, settings } from './storage';

import './mainStyle.css';

document.addEventListener('keydown', (e) => {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 82:
      settings.game.currShipOrientation = settings.game.currShipOrientation === VERTICAL ?
        HORIZONTAL : VERTICAL;
      break;
    case 69:
      settings.game.mapEditor = !settings.game.mapEditor;
      // render();
      break;

    default:
      break;
  }
});

const socket = io();
const connectToGame = (idGame) => {
  socket.emit('connectToGame', idGame);
};

socket.emit('login', false, (status) => {
  if (status === true) {
    console.log('Пользователь авторизован');
  } else {
    renderLoginHTML((nickname) => {
      socket.emit('login', nickname, (res) => {
        console.log(res);
        if (res === false) {
          console.log('Некорректные данные!!!');
        } else {
          console.log('Пользователь авторизован.');
          renderListHTML(
            [],
            (settingsGame) => {
              console.log(settingsGame);
              settings.size.grid = settingsGame.gridSize;
              settings.game.ships = settingsGame.ships;
              socket.emit('newGame', settingsGame);
            },
            connectToGame,
          );
          socket.emit('list');
        }
      });
    });
  }
});

socket.on('list', (data) => {
  console.log(data);
  refreshList(data, (idGame) => {
    console.log('idGame: ', idGame);
  });
});

socket.on('ships', (data) => {
  renderMyShipsHTML(data);
});

socket.on('resGame', (data) => {
  console.log('Результаты игры: ', data);
});

socket.on('game', (settingsGame) => {
  settings.size.grid = settingsGame.gridSize;
  settings.game.ships = settingsGame.ships;
  renderGameHTML(
    // callbackAttackCell
    (position, attackCell) => {
      socket.emit('attackCell', position, (status) => {
        attackCell(status);
      });
    },
    // callbackAddShips
    (ships, setShips) => {
      console.log('=======>');
      socket.emit('setShips', ships, (status) => {
        setShips(status);
      });
    });
});

socket.on('errorCode', (errCode) => {
  switch (errCode) {
    case 2:
      console.log('Обратный ответ');
      break;

    case 3:
      console.log('Пользователь уже авторизован');
      break;

    case 4:
      console.log('Противник потерял соединение с сервером');
      break;

    default:
      console.log('Неизвестная ошибка');
      break;
  }
});

socket.on('list', (arrList) => {
  if (Array.isArray(arrList)) {
    refreshList(arrList, connectToGame);
  }
});
