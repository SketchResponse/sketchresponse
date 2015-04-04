let templates = {
  button() {
    return (`
      <li class="button">
        <button></button>
      </li>
    `);
  },

  tool() {
    return (`
      <li class="tool">
        <button></button>
      </li>
    `);
  },
};

export default class Toolbar {
  constructor(targetElement, config) {
    targetElement.classList.add('si-toolbar');

    config.items = config.items || [];
    targetElement.innerHTML = config.items
      .map(item => templates[item.type](item))
      .join('');
  }
}
