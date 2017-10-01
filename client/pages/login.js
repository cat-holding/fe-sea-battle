export const renderLoginHTML = (callback) => {
  const root = document.getElementById('root');

  root.innerHTML =
    `<ul class="list">
      <li class="list_el">
        <form class="login">
          <input type="text" name="login" placeholder="Enter your name" minlength="3" maxlength="20" pattern="[a-zA-Zа-яА-Я0-9 ]+"
            required>
          <button class="btn reg_btn" type="submit">Sign in</button>
        </form>
      </li>
    </ul>`;

  const form = root.querySelector('#root > ul > li > form');
  const input = root.querySelector('input[name=login]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (typeof callback === 'function') {
      callback(input.value);
    }

    return false;
  });
};
