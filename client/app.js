import io from 'socket.io-client';

import { renderLoginHTML } from './pages/login';
import { renderListHTML, refreshList } from './pages/list';
import { renderGameHTML } from './pages/game';

import { VERTICAL, HORIZONTAL, settings } from './storage';


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

const socket = io('http://localhost:8080');
const connectToGame = (gameId) => {
  socket.emit('connectToGame', gameId);
};

socket.emit('login', false, (status) => {
  if (status === true) {
    console.log('Пользователь авторизован');
  } else {
    renderLoginHTML((nickname) => {
      socket.emit('login', nickname, (res) => {
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

socket.on('game', (settingsGame) => {
  settings.size.grid = settingsGame.gridSize;
  settings.game.ships = settingsGame.ships;
  console.log(settingsGame);
  renderGameHTML(socket);
});

socket.on('errorCode', (errCode) => {
  switch (errCode) {
    case 2:
      console.log('Обратный ответ');
      break;

    case 3:
      console.log('Пользователь уже авторизован');
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
