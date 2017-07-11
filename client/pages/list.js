
const generateListElem = (idGame, nickname, gridSize, ships, srcImg) =>
  `<li class="list_el">
        <div class="user-info">
          <div class="image-block">
          ${srcImg ? `<img class="image-block_img" src="${srcImg}" alt="user logo">` : ''}
          </div>
          <span class="nickname">${nickname}</span>
        </div>
        <div class="game-info">
          <span>${gridSize}x${gridSize}</span><span>4:${ships['4']}, 3:${ships['3']}, 2:${ships['2']}, 1:${ships['1']}</span>
        </div>
        <a idGame="${idGame}" class="btn play" href="#">Play</a>
      </li>`;

const getListHTML = (arr) => {
  let html = '';

  arr.forEach((el) => {
    html += generateListElem(el.idGame, el.nickname, el.gridSize, el.ships, el.srcImg);
  });

  return html;
};

const addEventOnBtnPlay = (callback) => {
  const play = root.querySelectorAll('a.btn.play');

  for (const btn of play) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      if (typeof callback === 'function') {
        callback(e.target.getAttribute('idGame'));
      }

      return false;
    });
  }
};

export const renderListHTML = (arr, callbackNewGame, callbackPlay) => {
  const root = document.getElementById('root');
  root.innerHTML =
    `<ul class="list">
      <li class="list_el settings-game">
        <div class="block">
        <span class="title">The size of the map</span>
        <input type="number" name="gridSize" value="10" min="10" max="20" step="1">
        </div>

        <div class="block">
          <span class="title">The number of ships depending on the size</span>
          <label>
              4:
              <input type="number" name="ship4" value="1" min="1" max="10" step="1">
            </label>
            <label>
              3:
              <input type="number" name="ship3" value="2" min="1" max="10" step="1">
            </label>
            <label>
              2:
              <input type="number" name="ship2" value="3" min="1" max="10" step="1">
            </label>
            <label>
              1:
              <input type="number" name="ship1" value="4" min="1" max="10" step="1">
            </label>
        </div>
      </li>
    </ul>
    <a class="btn new-game" href="#">Click to start a new game</a>
    <ul class="list games">
    ${Array.isArray(arr) && arr.length > 0 ? getListHTML(arr) : ''}
    </ul>`;

  const inputs = root.querySelectorAll('.settings-game input[type=number]');
  const newGame = root.querySelector('a.btn.new-game');

  newGame.addEventListener('click', (e) => {
    e.preventDefault();

    if (typeof callbackNewGame === 'function') {
      const settingsGame = {
        gridSize: +inputs[0].value,
        ships: {
          4: +inputs[1].value,
          3: +inputs[2].value,
          2: +inputs[3].value,
          1: +inputs[4].value,
        },
      };
      
      callbackNewGame(settingsGame);
    }

    return false;
  });

  addEventOnBtnPlay(callbackPlay);
};

export const refreshList = (arr, callbackPlay) => {
  const el = document.querySelector('#root ul.list.games');

  if (el !== null) {
    el.innerHTML = getListHTML(arr);
    addEventOnBtnPlay(callbackPlay);
  }
};
